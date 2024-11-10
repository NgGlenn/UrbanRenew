import { computed } from "vue";

export function useGanttFormat(jobs, tasks, contractorCompany, contractorStaff) {
    // console.log(typeof(jobs))
    // console.log(jobs)
    // console.log(typeof(tasks))
    // console.log(contractorStaff)
    
    //function to calculate duration in days
    const calculateDuration = (startDate, endDate) => {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    
    const ganttData = computed(() => {
        // if (!jobs.value || !tasks.value) return {data: [], links: []};
        if (!jobs?.value || !tasks?.value) {
            console.log('Missing job or task data:', { jobs, tasks });
            return [{
                jobId: '',
                jobName: '',
                contractorCompanyName: '',
                contractorStaff: '',
                task: []
            }];
        }

        //return formated data for each job
        return jobs.value.map(job => {
            //Retrieveing company name
            // const contractorCompanyName = contractorCompany.value.find(contractor => job.contractorId === contractor.id);
            
            //Retrieveing staff incharge name
            // const contractorStaffName = contractorStaff.value.find(staff => job.contractorId === staff.id);
            // const contractorPOC = contractorStaffName
            //     ? `${contractorStaffName?.lastName || ''} ${contractorStaffName?.firstName || ''}`.trim()
            //     : 'No POC assigned';
            let companyName = '';
            if (Array.isArray(contractorCompany?.value)) {
                // Customer view - array of companies
                const company = contractorCompany.value.find(contractor => job.contractorId === contractor.id);
                companyName = company?.companyName || '';
            } else {
                // Contractor view - single company
                companyName = contractorCompany?.value?.companyName || '';
            }

            // Handle both array and single object scenarios for staff
            let staffName = '';
            if (Array.isArray(contractorStaff?.value)) {
                // Customer view - array of staff
                const staff = contractorStaff.value.find(staff => job.contractorId === staff.id);
                staffName = staff ? `${staff.lastName || ''} ${staff.firstName || ''}`.trim() : 'No POC assigned';
            } else {
                // Contractor view - single staff member
                staffName = contractorStaff?.value ?
                    `${contractorStaff.value.lastName || ''} ${contractorStaff.value.firstName || ''}`.trim() :
                    'No POC assigned';
            }

            //Get tasks for this specific job
            const jobTasks = tasks.value.filter(task => task.jobId === job.id);
            
            //Format tasks according to Gantt Chart library format
            const formattedTasks = {};

            //Task data associated with Job
            const data = jobTasks.map(task => ({
                id: task.id,
                text: task.name,
                start_date: (task.startDate instanceof Date ? task.startDate : task.startDate.toDate()).toISOString().split('T')[0],
                duration: calculateDuration(task.startDate instanceof Date ? task.startDate : task.startDate.toDate(), task.endDate instanceof Date ? task.endDate : task.endDate.toDate()),
                progress: task.progress ? task.progress / 100 : 0
            }))


            //link array to connect task
            const taskLinks = [];
            let linkId = 1;
            // console.log(data)
            for (let index = 0; index < data.length; index++) {
                if (index < data.length - 1) {
                    taskLinks.push({
                        id: linkId,
                        source: data[index].id,
                        target: data[index + 1].id,
                        type: '0'
                    });
                }
                linkId++;
            }

            formattedTasks['data'] = data;
            formattedTasks['links'] = taskLinks;


            return {
                // jobId: job.id,
                // jobName: job.description,
                // contractorCompanyName: contractorCompanyName.companyName,
                // contractorStaff: contractorPOC,
                // task: formattedTasks
                jobId: job.id,
                jobName: job.jobName,
                contractorCompanyName: companyName,
                contractorStaff: staffName,
                task: formattedTasks
            }

        })
    })


    // console.log(ganttData)
    return {ganttData};

}

