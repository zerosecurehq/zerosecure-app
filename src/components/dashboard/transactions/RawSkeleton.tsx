import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

const RawSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <TableRow className="text-center relative h-[52px]" key={index}>
          <TableCell>
            <Skeleton className="h-4 w-32 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 mx-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-24 mx-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default RawSkeleton;
