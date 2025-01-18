import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { STEPS, Step } from '@/pages/BloodDonationRegistration';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

const SelectDateStep = ({ dateRange, setDateRange, setCurrentStep }: { dateRange: DateRange, setDateRange: (range: DateRange) => void, setCurrentStep: (step: Step) => void }) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>Chọn khoảng thời gian</CardTitle>
        <CardDescription>
          Chọn khoảng thời gian bạn có thể tham gia hiến máu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PPP", { locale: vi })
                ) : (
                  <span>Chọn ngày bắt đầu</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) =>
                  setDateRange({ ...dateRange, from: date })
                }
                disabled={(date) => date < new Date()}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PPP", { locale: vi })
                ) : (
                  <span>Chọn ngày kết thúc</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) =>
                  setDateRange({ ...dateRange, to: date })
                }
                disabled={(date) => {
                  return date < new Date() || (dateRange.from ? date < dateRange.from : false);
                }}
                locale={vi}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="w-full bg-red-600 text-white hover:bg-red-700"
          disabled={!dateRange.from || !dateRange.to}
          onClick={() => setCurrentStep(STEPS.SELECT_CAMPAIGN)}
        >
          Tiếp tục
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SelectDateStep; 