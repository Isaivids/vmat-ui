export const generateUniqueId = () => {
    const now = new Date();
    const datePart = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0') +
        now.getMilliseconds().toString().padStart(3, '0');
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const randomPart = Array.from({ length: 5 }, () => alphabets[Math.floor(Math.random() * alphabets.length)]).join('');
    return datePart + randomPart;
}

export const getNextSerialNumber = (sno: string) => {
    const [currentSerialNumber, currentMonth] = sno.split('-').map(Number);
    const date = new Date();
    const currentMonthFromSystem = (date.getMonth() + 1).toString().padStart(2, '0');
    let newSerialNumber, newMonth;
    if (currentMonthFromSystem !== currentMonth.toString().padStart(2, '0')) {
        newSerialNumber = 1;
        newMonth = currentMonthFromSystem;
    } else {
        newSerialNumber = currentSerialNumber + 1;
        newMonth = currentMonth.toString().padStart(2, '0');
    }
    const newSno = `${newSerialNumber.toString().padStart(2, '0')}-${newMonth}`;
    return newSno;
}
const getFormatteddate = (inputDate: any) => {
    if ([null, undefined, ""].includes(inputDate)) {
        return "";
    } else {
        const date = new Date(inputDate);
        const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        )
            .toISOString()
            .split("T")[0];
        return localDate;
    }
};

export const getNewdataPayload = (inputObject: any) => {
    const outputObject = {
        sno: inputObject.sno,
        date: getFormatteddate(inputObject.date),
        truckname: inputObject.truckname,
        trucknumber: inputObject.trucknumber,
        transname: inputObject.transname,
        from: inputObject.from,
        to: inputObject.to,
        truckadv: Number(inputObject.truckadv),
        transaddvtype: Number(inputObject.transaddvtype),
        repdate: getFormatteddate(inputObject.repdate),
        unloaddate: getFormatteddate(inputObject.unloaddate),
        deliverydate: getFormatteddate(inputObject.deliverydate),
        reportingdate: getFormatteddate(inputObject.reportingdate),
        lateday: inputObject.lateday,
        halting: inputObject.halting,
        truckf: Number(inputObject.truckf),
        transf: Number(inputObject.transf),
        vmatf: Number(inputObject.vmatf),
        modeofadvance: Number(inputObject.modeofadvance),
        transbalancetype: inputObject.transbalancetype,
        truckbalancetype: inputObject.truckbalancetype,
        transadv: Number(inputObject.transadv),
        truckbln: Number(inputObject.truckbln),
        transbln: Number(inputObject.transbln),
        twopay: Number(inputObject.twopay),
        truckloadwt: Number(inputObject.truckloadwt),
    };
    return outputObject;
};