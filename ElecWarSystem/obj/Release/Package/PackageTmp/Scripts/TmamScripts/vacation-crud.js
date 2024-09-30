window.onload = function () {
    setVacationCouter();
    RequestTmamStatus();
    numbersE2A();
}

// تحقق من ملء جميع الحقول
function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#vacation-type").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "";
    return result;
}

// تعطيل/تمكين زر الحفظ
function disableBtn() {
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    }
    else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}
function Add() {
    var dateFrom = $("#date-from").val();
    var dateTo = $("#date-to").val();
    var personId = $("#person-name").val();
    var vacationType = $("#vacation-type").val();

    // التحقق من أن جميع الحقول تم تعبئتها
    if (!dateFrom || !dateTo || !personId || !vacationType) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى تعبئة جميع الحقول المطلوبة',
        });
        return;
    }

    // التحقق من التواريخ (التأكد من أن تاريخ البداية أقل من تاريخ النهاية)
    if (new Date(dateFrom) >= new Date(dateTo)) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'تاريخ بدء الأجازة يجب أن يكون قبل تاريخ عودة الأجازة',
        });
        return;
    }

    // إجراء طلب AJAX
    $.ajax({
        url: window.location.origin + "/Vacation/Create",
        type: "POST",
        async: false,
        data: {
            "VacationDetail.PersonID": personId,
            "VacationDetail.VacationType": vacationType,
            "VacationDetail.DateFrom": dateFrom,
            "VacationDetail.DateTo": dateTo
        },
        success: function (result) {
            if (result == -1) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'يوجد خطأ فى تاريخ الأجازة',
                });
            } else if (result == 1) {  // تحقق من أن الاستجابة تشير إلى النجاح
                Swal.fire({
                    icon: 'success',
                    title: 'تم بنجاح',
                    text: 'تم إضافة الأجازة بنجاح',
                });
                $('#vacationModal').modal('hide');  // إغلاق المودال بعد الإضافة
                UpdateVacationsTable();
                IncreaseVacationCounter();
                emptyFormField();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'تحذير',
                    text: 'حدث أمر غير متوقع',
                });
            }
        },
        error: function (xhr, status, error) {
            // التعامل مع الأخطاء التي تحدث أثناء طلب Ajax
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء معالجة الطلب: ' + error,
            });
        }
    });
}


function openVacationPopup() {
    $('#vacationModal').modal('show');  // Ensure the modal is shown when the button is clicked
}

// إفراغ حقول النموذج
function emptyFormField() {
    $("#person-name").val(null);
    $("#person-rank").val(null);
    $("#vacation-type").val(null);
    $("#date-from").val(null);
    $("#date-to").val(null);
}

// تحديث جدول الأجازات
function UpdateVacationsTable() {
    $.ajax({
        url: window.location.origin + "/Vacation/GetVacation",
        type: "GET",
        async: false,
        success: function (result) {
            fillVacationTable(result);
        }
    });
}

// ملء جدول الأجازات
function fillVacationTable(result) {
    $("#vacations-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>نوع الأجازة</th>
            <th>بدء الأجازة</th>
            <th>عودة الأجازة</th>
            <th></th>
        </thead>`;
    $("#vacations-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['VacationDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['VacationDetail']['Person']['FullName']}</td>
                <td>${result[index]['VacationDetail']['VacationType']}</td>
                <td>${getDateFormated(result[index]['VacationDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['VacationDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteVacation(${result[index]["ID"]})">
                        
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tbody>`;
        $("#vacations-table").append(tableItem);
    }
}

// ضبط عداد الأجازات
function setVacationCouter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    if (totalVacationCount === currentVacationCount) {
        $("#add-vacation-btn").attr('disabled', 'disabled');
    } else {
        $("#add-vacation-btn").removeAttr('disabled');
    }
}

// زيادة عداد الأجازات
function IncreaseVacationCounter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    currentVacationCount += 1;
    if (totalVacationCount === currentVacationCount) {
        $("#add-vacation-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentVacationCount} / ${totalVacationCount}`;
    $("#vacation-counter").text(newStr);
}

// تقليل عداد الأجازات
function DecreaseVacationCounter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    currentVacationCount -= 1;
    $("#add-vacation-btn").removeAttr('disabled');
    var newStr = `${currentVacationCount} / ${totalVacationCount}`;
    $("#vacation-counter").text(newStr);
}

function deleteVacation(id) {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من التراجع عن هذا!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذفها!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: window.location.origin + "/Vacation/Delete",
                type: "POST",
                async: false,
                data: {
                    "VacationID": id,
                },
                success: function (result) {
                    UpdateVacationsTable();
                    DecreaseVacationCounter();
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }
    });
}
