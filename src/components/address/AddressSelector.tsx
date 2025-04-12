import React, { useEffect, useState } from 'react';

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface AddressSelectorProps {
  onAddressSelect: (address: string) => void;
  initialAddress?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ onAddressSelect, initialAddress = '' }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [specificAddress, setSpecificAddress] = useState("");

  const [activeTab, setActiveTab] = useState<"province" | "district" | "ward">("province");

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    // Parse initialAddress if provided
    if (initialAddress) {
      const addressParts = initialAddress.split(', ').filter(Boolean);
      if (addressParts.length >= 2) {
        setSpecificAddress(addressParts[0]);
      }
    }
  }, [initialAddress]);

  const handleSelectProvince = (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setActiveTab("district");

    fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []));
  };

  const handleSelectDistrict = (district: District) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setActiveTab("ward");

    fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []));
  };

  const handleSelectWard = (ward: Ward) => {
    setSelectedWard(ward);
    updateFullAddress(specificAddress, selectedProvince, selectedDistrict, ward);
  };

  const updateFullAddress = (specific: string, province: Province | null, district: District | null, ward: Ward | null) => {
    if (!province || !district || !ward) return;
    
    const fullAddress = [
      specific,
      ward.name,
      district.name,
      province.name
    ]
      .filter(Boolean)
      .join(", ");
      
    onAddressSelect(fullAddress);
  };

  const handleSpecificAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecificAddress(e.target.value);
    if (selectedProvince && selectedDistrict && selectedWard) {
      updateFullAddress(e.target.value, selectedProvince, selectedDistrict, selectedWard);
    }
  };

  const fullAddress = [
    specificAddress,
    selectedWard?.name,
    selectedDistrict?.name,
    selectedProvince?.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className=" bg-gray-50">
      <label className="text-sm text-gray-500">Địa chỉ cụ thể</label>
      <div className="mt-1">
        <input 
          type="text" 
          value={specificAddress}
          onChange={handleSpecificAddressChange}
          placeholder="Số nhà, tên đường (VD: Số 51, Trần Hưng Đạo)"
          className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm text-gray-500">Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã</label>
        <div className="mt-1 font-medium">{fullAddress || "Chưa chọn địa chỉ"}</div>
      </div>

      <div className="mt-4 border-b flex">
        <button
          className={`flex-1 p-2 text-sm font-medium ${
            activeTab === "province"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("province")}
        >
          Tỉnh/Thành phố
        </button>
        <button
          className={`flex-1 p-2 text-sm font-medium ${
            activeTab === "district"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500"
          }`}
          onClick={() => selectedProvince && setActiveTab("district")}
          disabled={!selectedProvince}
        >
          Quận/Huyện
        </button>
        <button
          className={`flex-1 p-2 text-sm font-medium ${
            activeTab === "ward"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-500"
          }`}
          onClick={() => selectedDistrict && setActiveTab("ward")}
          disabled={!selectedDistrict}
        >
          Phường/ Xã
        </button>
      </div>

      <div className="mt-2 max-h-60 overflow-y-auto text-sm">
        {activeTab === "province" &&
          provinces.map((p) => (
            <div
              key={p.code}
              onClick={() => handleSelectProvince(p)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {p.name}
            </div>
          ))}

        {activeTab === "district" &&
          districts.map((d) => (
            <div
              key={d.code}
              onClick={() => handleSelectDistrict(d)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {d.name}
            </div>
          ))}

        {activeTab === "ward" &&
          wards.map((w) => (
            <div
              key={w.code}
              onClick={() => handleSelectWard(w)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {w.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddressSelector; 