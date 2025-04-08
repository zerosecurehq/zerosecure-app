import { TableCell, TableRow } from '@/components/ui/table';
import { removeVisibleModifier } from 'zerosecurehq-sdk';

interface GovernanceCardProps {
  data: string;
}

const GovernanceCard = ({
  data
}: GovernanceCardProps) => {
  return (
    <TableRow>
      <TableCell>{removeVisibleModifier(data)}</TableCell>
    </TableRow>
  )
}

export default GovernanceCard