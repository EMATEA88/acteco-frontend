import { type ReactNode } from "react";

interface DataTableProps {

  headers: ReactNode[];

  children: ReactNode;

  empty?: ReactNode;

  hasData: boolean;

}

export default function DataTable({

  headers,

  children,

  empty,

  hasData

}: DataTableProps) {

  return (

    <div className="bg-white rounded-xl shadow overflow-hidden">

      <div className="overflow-auto">

        <table className="min-w-full">

          <thead>

            <tr className="bg-gray-100 border-b">

              {

                headers.map(

                  (

                    header,

                    index

                  ) => (

                    <th

                      key={index}

                      className="text-left p-4"

                    >

                      {header}

                    </th>

                  )

                )

              }

            </tr>

          </thead>

          <tbody>

            {

              hasData

                ? children

                : (

                  <tr>

                    <td

                      colSpan={headers.length}

                      className="text-center py-12 text-gray-500"

                    >

                      {

                        empty ||

                        "Nenhum registo encontrado."

                      }

                    </td>

                  </tr>

                )

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}