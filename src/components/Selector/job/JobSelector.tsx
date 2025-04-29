import React, { useEffect, useState } from 'react';
import { staticJobApi } from '@/api/static';
import { toast } from '@/components/ui/use-toast';
import { Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  job: string;
}

interface JobSelectorProps {
  onJobSelect: (job: string) => void;
  initialJob?: string;
  trigger?: React.ReactNode;
}

const JobSelector: React.FC<JobSelectorProps> = ({ 
  onJobSelect, 
  initialJob = '',
  trigger
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>(initialJob);
  const [open, setOpen] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await staticJobApi();
        if (response && response.data) {
          setJobs(response.data);
        } else {
          console.error('Invalid job data response:', response);
          toast({
            title: 'Lỗi',
            description: 'Không thể tải danh sách nghề nghiệp',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách nghề nghiệp',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job.job);
    onJobSelect(job.job);
  };

  const handleConfirm = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size='sm' className="ml-2 justify-start">
            <Pencil className='w-4 h-4' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chọn nghề nghiệp</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm text-gray-500 mb-1">Tìm kiếm nghề nghiệp</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên nghề nghiệp..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-1">Nghề nghiệp đã chọn</div>
            <div className="font-medium">{selectedJob || "Chưa chọn nghề nghiệp"}</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-red-500" />
            </div>
          ) : (
            <div className="mt-4 max-h-60 overflow-y-auto">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    className={`px-3 py-2 cursor-pointer transition-colors ${
                      selectedJob === job.job
                        ? 'bg-red-50 text-red-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {job.job}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Không tìm thấy nghề nghiệp phù hợp
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant='outline' onClick={() => {
              setOpen(false)
              setSelectedJob('')
            }}>
              Hủy
            </Button>
            <Button variant='destructive' onClick={handleConfirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobSelector;