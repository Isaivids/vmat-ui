export const validateFields = (data: any) => {
    const requiredFields = [
        "address",
        "phonenumber",
        "truckname",
        "transportname",
    ];

    const missingFields = requiredFields.filter(field => [null,undefined,''].includes(data[field]));
    return {
        isValid: missingFields.length === 0,
        missingFields,
    };
};