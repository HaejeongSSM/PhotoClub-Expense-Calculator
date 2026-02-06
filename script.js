document.addEventListener('DOMContentLoaded', () => {
    const totalDistanceInput = document.getElementById('totalDistance');
    const fuelEfficiencyInput = document.getElementById('fuelEfficiency');
    const fuelPriceInput = document.getElementById('fuelPrice');
    const tollFeeInput = document.getElementById('tollFee');
    const numDriversInput = document.getElementById('numDrivers');
    const numNonDriversInput = document.getElementById('numNonDrivers');
    const foodExpensesInput = document.getElementById('foodExpenses');
    const snackExpensesInput = document.getElementById('snackExpenses');
    const admissionFeesInput = document.getElementById('admissionFees');
    const parkingFeesInput = document.getElementById('parkingFees');
    const otherExpensesInput = document.getElementById('otherExpenses');
    const calculateBtn = document.getElementById('calculateBtn');

    const totalAttendeesSpan = document.getElementById('totalAttendees');
    const carExpensePerCarSpan = document.getElementById('carExpensePerCar');
    const carExpensePerPersonSpan = document.getElementById('carExpensePerPerson');
    const foodExpensePerPersonSpan = document.getElementById('foodExpensePerPerson');
    const snackExpensePerPersonSpan = document.getElementById('snackExpensePerPerson');
    const admissionFeePerPersonSpan = document.getElementById('admissionFeePerPerson');
    const parkingFeePerPersonSpan = document.getElementById('parkingFeePerPerson');
    const otherExpensePerPersonSpan = document.getElementById('otherExpensePerPerson');
    const driverFeeSpan = document.getElementById('driverFee'); // This will be the adjusted fee
    const pureDriverFeeSpan = document.getElementById('pureDriverFee'); // New span for pure shared expenses
    const nonDriverFeeSpan = document.getElementById('nonDriverFee');

    calculateBtn.addEventListener('click', calculateExpenses);

    function calculateExpenses() {
        const totalDistance = parseFloat(totalDistanceInput.value);
        const fuelEfficiency = parseFloat(fuelEfficiencyInput.value);
        const fuelPrice = parseFloat(fuelPriceInput.value);
        const tollFee = parseFloat(tollFeeInput.value);
        const numDrivers = parseInt(numDriversInput.value);
        const numNonDrivers = parseInt(numNonDriversInput.value);
        const foodExpenses = parseFloat(foodExpensesInput.value);
        const snackExpenses = parseFloat(snackExpensesInput.value);
        const admissionFees = parseFloat(admissionFeesInput.value);
        const parkingFees = parseFloat(parkingFeesInput.value);
        const otherExpenses = parseFloat(otherExpensesInput.value);

        // Input validation (basic)
        if (isNaN(totalDistance) || isNaN(fuelEfficiency) || isNaN(fuelPrice) || isNaN(tollFee) ||
            isNaN(numDrivers) || isNaN(numNonDrivers) || isNaN(foodExpenses) || isNaN(snackExpenses) ||
            isNaN(admissionFees) || isNaN(parkingFees) || isNaN(otherExpenses)) {
            alert('모든 필드에 유효한 숫자를 입력해주세요.');
            return;
        }

        if (fuelEfficiency <= 0) {
            alert('평균 연비는 0보다 커야 합니다.');
            return;
        }
        if (numDrivers < 0 || numNonDrivers < 0) {
            alert('인원은 0 이상이어야 합니다.');
            return;
        }

        const totalAttendees = numDrivers + numNonDrivers;
        totalAttendeesSpan.textContent = totalAttendees;

        // 1. 차량 운행 경비 계산 (1대 기준)
        const fuelConsumed = totalDistance / fuelEfficiency;
        const fuelCost = fuelConsumed * fuelPrice;
        const carOperatingCostPerCar = Math.round(fuelCost + tollFee); // This is for ONE car, rounded
        carExpensePerCarSpan.textContent = carOperatingCostPerCar.toLocaleString();

        // Calculate total car operating cost based on number of drivers (cars)
        const totalCarOperatingCost = carOperatingCostPerCar * numDrivers;

        // 2. 차량 운행 경비 (1인당, 운전자 제외)
        let carExpensePerPerson = 0;
        if (numNonDrivers > 0) {
            carExpensePerPerson = Math.round(totalCarOperatingCost / numNonDrivers); // Rounded
        }
        carExpensePerPersonSpan.textContent = carExpensePerPerson.toLocaleString();

        // 3. 식대 (1인당, 운전자 포함)
        let foodExpensePerPerson = 0;
        if (totalAttendees > 0) {
            foodExpensePerPerson = Math.round(foodExpenses / totalAttendees);
        }
        foodExpensePerPersonSpan.textContent = foodExpensePerPerson.toLocaleString();

        // 4. 간식대 (1인당, 운전자 포함)
        let snackExpensePerPerson = 0;
        if (totalAttendees > 0) {
            snackExpensePerPerson = Math.round(snackExpenses / totalAttendees);
        }
        snackExpensePerPersonSpan.textContent = snackExpensePerPerson.toLocaleString();

        // 5. 입장료 (1인당, 운전자 포함)
        let admissionFeePerPerson = 0;
        if (totalAttendees > 0) {
            admissionFeePerPerson = Math.round(admissionFees / totalAttendees);
        }
        admissionFeePerPersonSpan.textContent = admissionFeePerPerson.toLocaleString();

        // 6. 주차비 (1인당, 운전자 포함)
        let parkingFeePerPerson = 0;
        if (totalAttendees > 0) {
            parkingFeePerPerson = Math.round(parkingFees / totalAttendees);
        }
        parkingFeePerPersonSpan.textContent = parkingFeePerPerson.toLocaleString();

        // 7. 기타 경비 (1인당, 운전자 포함)
        let otherExpensePerPerson = 0;
        if (totalAttendees > 0) {
            otherExpensePerPerson = Math.round(otherExpenses / totalAttendees);
        }
        otherExpensePerPersonSpan.textContent = otherExpensePerPerson.toLocaleString();

        // 8. 개인별 총 부담 금액: 운전자 회비와 비운전자 회비로 구분
        // 순수한 운전자 회비 (공동 경비만)
        let pureDriverFeeValue = foodExpensePerPerson + snackExpensePerPerson + admissionFeePerPerson + parkingFeePerPerson + otherExpensePerPerson;

        // 조정된 운전자 회비 = 차량 1대당 운행경비 - (순수한 운전자 회비)
        // 이는 운전자가 차량 운영에 대한 보전을 받고, 남은 공동 경비를 지불하는 개념으로 해석됩니다.
        let adjustedDriverFeeValue = carOperatingCostPerCar - pureDriverFeeValue;
        let nonDriverFeeValue = carExpensePerPerson + pureDriverFeeValue;

        // 백원단위이하 금액 올림 처리 (천원 단위)
        pureDriverFeeValue = Math.ceil(pureDriverFeeValue / 1000) * 1000;
        adjustedDriverFeeValue = Math.ceil(adjustedDriverFeeValue / 1000) * 1000;
        nonDriverFeeValue = Math.ceil(nonDriverFeeValue / 1000) * 1000;

        pureDriverFeeSpan.textContent = pureDriverFeeValue.toLocaleString();
        driverFeeSpan.textContent = adjustedDriverFeeValue.toLocaleString(); // Use driverFeeSpan for adjusted fee
        nonDriverFeeSpan.textContent = nonDriverFeeValue.toLocaleString();
    }

    // Initial calculation on page load
    calculateExpenses();
});