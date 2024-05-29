export const validateFields = (data: any) => {
    const requiredFields = [
        "sno",
        "date",
        "truckname",
        "trucknumber",
        "transname",
        "from",
        "to",
        "repdate",
        "unloaddate",
        "lateday",
        "halting",
        "truckf",
        "transf",
        "vmatf",
        "transadv",
        "vmatadv",
        "transaddvtype",
        "modeofadvance",
        "truckadv",
        "truckbln",
        "transbln",
        "twopay",
        "truckloadwt",
    ];

    const missingFields = requiredFields.filter(field => [null,undefined,''].includes(data[field]));

    return {
        isValid: missingFields.length === 0,
        missingFields,
    };
};