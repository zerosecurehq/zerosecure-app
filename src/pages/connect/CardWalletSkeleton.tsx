import { Skeleton } from "@/components/ui/skeleton";

const CardWalletSkeleton = () => {
  return (
    <Skeleton className="w-[702px] h-[82px] p-4">
      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-40 h-3 rounded-full mb-2" />
            <Skeleton className="w-20 h-4 rounded-full mb-2" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </Skeleton>
  );
};

export default CardWalletSkeleton;
