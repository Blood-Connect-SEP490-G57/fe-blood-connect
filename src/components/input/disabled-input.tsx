import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export default function DisabledInput({ title, value }: { title: string; value: string | number }) {
  return (
    <>
      <Label>{title}</Label>
      <Textarea className='mt-1 mb-4 min-h-fit' disabled value={value} />
    </>
  )
}
