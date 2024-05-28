export const validateFields = (data: any) => {
    const requiredFields = [
        "loadunloadchar",
        "paymentreceiveddate",
        "modeofpayment",
    ];

    const missingFields = requiredFields.filter(field => [null,undefined,''].includes(data[field]));

    return {
        isValid: missingFields.length === 0,
        missingFields,
    };
};