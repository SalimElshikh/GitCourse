window.onload = function () {
    setSickLeaveCounter();
    RequestTmamStatus();
    numbersE2A();
    disableBtn();
}

// Function to check if all fields are filled
function IsAllFieldsFilled() {
    return $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#hospital-name").val() !== "" &&
        $("#hospital-date").val() !== "" &&
        $("#diagnosis").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "";
}

// Function to enable/disable the submit button
function disableBtn() {
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    } else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}

// Function to add a new sick leave
function Add() {
    if (IsAllFieldsFilled()) {  // تأكد من أن جميع الحقول معبأة قبل محاولة الإضافة
        const dateFrom = $("#date-from").val();
        const dateTo = $("#date-to").val();

        // التحقق من أن التواريخ غير متساوية
        if (dateFrom === dateTo) {
            Swal.fire({
                icon: 'warning',
                title: 'تحذير',
                text: 'تاريخ البداية وتاريخ النهاية لا يمكن أن يكونا متساويين.',
            });
            return;  // منع الإضافة إذا كانت التواريخ متساوية
        }

        // استمر في الإضافة إذا كانت التواريخ غير متساوية
        $.ajax({
            url: `${window.location.origin}/SickLeave/Create`,
            type: "POST",
            async: false,
            data: {
                "SickLeaveDetail.PersonID": $("#person-name").val(),
                "SickLeaveDetail.Hospital": $("#hospital-name").val(),
                "SickLeaveDetail.HospitalDate": $("#hospital-date").val(),
                "SickLeaveDetail.Diagnosis": $("#diagnosis").val(),
                "SickLeaveDetail.DateFrom": dateFrom,
                "SickLeaveDetail.DateTo": dateTo
            },
            success: function (result) {
                if (result == -1) {
                    Swal.fire({
                        icon: 'success',
                        title: 'تمت الإضافة',
                        text: 'تمت إضافة الأجازة المرضية بنجاح!',
                    });
                } else {
                    closePop();
                    UpdateErrandsTable();
                    IncreaseSickLeaveCounter();
                    clearFormFields();
                    Swal.fire({
                        icon: 'success',
                        title: 'تمت الإضافة',
                        text: 'تمت إضافة الأجازة المرضية بنجاح!',
                    });
                }
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'تحذير',
            text: 'يرجى تعبئة جميع الحقول قبل الإضافة.',
        });
    }
}

// Function to clear form fields after submission
function clearFormFields() {
    $("#person-name, #person-rank, #hospital-name, #hospital-date, #diagnosis, #date-from, #date-to").val(null);
}

// Function to update the sick leave table with fresh data
function UpdateErrandsTable() {
    $.ajax({
        url: `${window.location.origin}/SickLeave/GetSickLeave`,
        type: "GET",
        async: false,
        success: function (result) {
            fillSickLeaveTable(result);
        }
    });
}

// Function to fill the sick leave table with data
function fillSickLeaveTable(result) {
    const $table = $("#sick-leaves-table");
    $table.empty();

    const tableHead = `
        <thead>
            <tr>
                <th>م</th>
                <th>الرتبة / الدرجة</th>
                <th>الإسم</th>
                <th>المستشفى</th>
                <th>تاريخ دخول المستشفى</th>
                <th>التشخيص</th>
                <th>بدء الأجازة</th>
                <th>عودة الأجازة</th>
                <th>الإجراءات</th>
            </tr>
        </thead>`;

    $table.append(tableHead);

    result.forEach((leave, index) => {
        const tableItem = `
            <tbody style="font-size:14px;">
                <tr>
                    <td>${index + 1}</td>
                    <td>${leave.SickLeaveDetail.Person.Rank.RankName}</td>
                    <td>${leave.SickLeaveDetail.Person.FullName}</td>
                    <td>${leave.SickLeaveDetail.Hospital}</td>
                    <td>${getDateFormated(leave.SickLeaveDetail.HospitalDate)}</td>
                    <td>${leave.SickLeaveDetail.Diagnosis}</td>
                    <td>${getDateFormated(leave.SickLeaveDetail.DateFrom)}</td>
                    <td>${getDateFormated(leave.SickLeaveDetail.DateTo)}</td>
                    <td>
                        <button class="btn btn-outline-danger btn-sm rounded-circle" onclick="deleteSickLeave(${leave.ID})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            </tbody>`;
        $table.append(tableItem);
    });
}

// Function to open the sick leave popup
function openSickLevelPopup() {
    $('#sickLeaveModal').modal('show');  // Ensure the modal is shown when the button is clicked
}

// Function to set the sick leave counter
function setSickLeaveCounter() {
    const [currentSickLeaveCount, totalSickLeaveCount] = $("#sick-leave-counter").text().split("/").map(Number);
    if (currentSickLeaveCount === totalSickLeaveCount) {
        $("#add-sick-leave-btn").attr('disabled', 'disabled');
    } else {
        $("#add-sick-leave-btn").removeAttr('disabled');
    }
}

// Function to increase the sick leave counter
function IncreaseSickLeaveCounter() {
    const [currentSickLeaveCount, totalSickLeaveCount] = $("#sick-leave-counter").text().split("/").map(Number);
    const newCount = currentSickLeaveCount + 1;
    const newText = `${newCount} / ${totalSickLeaveCount}`;
    $("#sick-leave-counter").text(newText);

    if (newCount === totalSickLeaveCount) {
        $("#add-sick-leave-btn").attr('disabled', 'disabled');
    }
}

// Function to decrease the sick leave counter
function DecreaseSickLeaveCounter() {
    const [currentSickLeaveCount, totalSickLeaveCount] = $("#sick-leave-counter").text().split("/").map(Number);
    const newCount = currentSickLeaveCount - 1;
    $("#sick-leave-counter").text(`${newCount} / ${totalSickLeaveCount}`);
    $("#add-sick-leave-btn").removeAttr('disabled');
}

// Function to close the popup
function closePop() {
    document.querySelector("#sickLeaveModal").classList.remove("act");
}

// Function to delete a sick leave
function deleteSickLeave(id) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من التراجع عن هذا!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذفها!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${window.location.origin}/SickLeave/Delete`,
                type: "POST",
                async: false,
                data: { id },
                success: function () {
                    UpdateErrandsTable();
                    DecreaseSickLeaveCounter();
                    Swal.fire(
                        'تم الحذف!',
                        'تم حذف الأجازة المرضية بنجاح.',
                        'success'
                    );
                }
            });
        }
    });
}
