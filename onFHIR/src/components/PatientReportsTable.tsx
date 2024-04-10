import { DiagnosticReportSortOrder } from "@bonfhir/core/r4b";
import { useFhirSearch } from "@bonfhir/query/r4b";
import {
  FhirPagination,
  FhirQueryLoader,
  FhirTable,
  FhirValue,
  useFhirSearchController,
} from "@bonfhir/react/r4b";
import { FC, ReactElement } from "react";

type PatientReportsTableProps = {
  patientId: string;
};

const PatientReportsTable: FC<PatientReportsTableProps> = ({
  patientId,
}): ReactElement => {
  const searchController = useFhirSearchController<DiagnosticReportSortOrder>({
    pageSize: 5,
  });

  const diagnosticReportsQuery = useFhirSearch(
    "DiagnosticReport",
    (search) =>
      search
        .patient(patientId)
        ._sort("issued")
        ._count(searchController.pageSize)
        ._total("accurate"),
    searchController.pageUrl,
  );

  return (
    <FhirQueryLoader query={diagnosticReportsQuery}>
      <FhirTable
        {...diagnosticReportsQuery}
        {...searchController}
        columns={[
          {
            key: "code",
            title: "Test",
            render: (diagnosticReport) => (
              <FhirValue type="CodeableConcept" value={diagnosticReport.code} />
            ),
          },
          {
            key: "issued",
            title: "Date Issued",
            render: (diagnosticReport) => (
              <FhirValue type="date" value={diagnosticReport.issued} />
            ),
          },
          {
            key: "status",
            title: "Status",
            render: (diagnosticReport) => (
              <FhirValue type="string" value={diagnosticReport.status} />
            ),
          },
        ]}
      />
      <FhirPagination {...diagnosticReportsQuery} {...searchController} />
    </FhirQueryLoader>
  );
};

export default PatientReportsTable;