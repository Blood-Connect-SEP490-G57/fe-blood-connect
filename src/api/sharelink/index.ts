import axios from 'axios'

export async function shortenUrl(longUrl: string) {
  const BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN
  try {
    const response = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: longUrl },
      {
        headers: {
          Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data.link
  } catch (error) {
    console.error('Lỗi rút gọn link:', error)
    return longUrl // Trả về link gốc nếu có lỗi
  }
}
