import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center space-y-6">
        <div className="space-y-2">
          <h1 className={cn(
            "text-6xl font-bold tracking-tighter",
            "bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"
          )}>
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Oops! Trang này không tồn tại
          </h2>
          <p className="text-muted-foreground">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="px-8"
          >
            Quay về trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage; 