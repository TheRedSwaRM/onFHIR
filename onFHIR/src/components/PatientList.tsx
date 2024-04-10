// import React, {useState} from 'react';
import { PatientSortOrder } from "@bonfhir/core/r4b";
import { useFhirSearch } from "@bonfhir/query/r4b";
import { FhirTable, FhirValue, FhirQueryLoader, useFhirSearchController, FhirPagination } from '@bonfhir/react/r4b';
// import { ReactElement } from "react";

// type PatientListTableProps = {
//     patientId: string;
//   };

const PatientListTable = () => {
//   const [selectedPatient, setSelectedPatient] = useState(null);
  
//   const handlePatientClick = (patient) => {
//     setSelectedPatient(patient);
//   };

    // const searchController = useFhirSearchController<PatientSortOrder>({
    //     pageSize: 10,
    // });

    const patientQuery = useFhirSearch("Patient", (search) => search._sort("identifier"),
    // searchController.pageUrl,
    );

    return (
        <FhirQueryLoader query={patientQuery}>
            <FhirTable 
            {...patientQuery}
            columns={[
                {
                    key:"name",
                    title:"Name",
                    render: (patient) => <FhirValue type="HumanName" value={patient.name} />
                },
                
                {
                    key:"gender",
                    title:"Gender",
                    render: (patient) => <FhirValue type="code" value={patient.gender} />
                },
                
                {
                    key:"birthDate",
                    title:"Birthday",
                    render: (patient) => <FhirValue type="date" value={patient.birthDate} />
                }
            ]}
            />
            
      {/* <FhirPagination {...patientQuery} {...searchController} /> */}
        </FhirQueryLoader>
    );
};

export default PatientListTable