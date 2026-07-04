import {
  CheckCircle2,
  Clock3,
  XCircle
} from "lucide-react";

interface Props {

  status: string;

}

export default function StatusBadge({

  status

}: Props) {

  switch (status) {

    case "COMPLETED":

    case "APPROVED":

    case "ACTIVE":

    case "PAID":

      return (

        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm">

          <CheckCircle2 size={15} />

          {status}

        </span>

      );

    case "PENDING":

    case "IN_PROGRESS":

      return (

        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-sm">

          <Clock3 size={15} />

          {status}

        </span>

      );

    default:

      return (

        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 text-red-700 px-3 py-1 text-sm">

          <XCircle size={15} />

          {status}

        </span>

      );

  }

}