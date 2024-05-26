export const validateFields = (data: any) => {
    const requiredFields = [
        "sno",
        "date",
        "truckname",
        "trucknumber",
        "transname",
        "from",
        "to",
        "truckad",
        "repdate",
        "unloaddate",
        "lateday",
        "halting",
        "truckf",
        "transf",
        "vmatf",
        "truckadv",
        "transadv",
        "truckbln",
        "transbln",
        "twopay",
        "truckloadwt",
    ];

    const missingFields = requiredFields.filter(field => !data[field]);

    return {
        isValid: missingFields.length === 0,
        missingFields,
    };
};