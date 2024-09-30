(function () {
    var mod = angular.module("CourseMod", []);
    mod.controller("CourseCrud", function ($scope) {
        $scope.Name = "تمام الفرق و الدورات التعليمية";
        $scope.Courses = GetCourses();
        var numbers = GetNumbers();
        $scope.CoursesTotal = numbers["total"];
        $scope.CoursesEntered = numbers["entered"];
        setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered);

        // إضافة دورة جديدة
        $scope.Add = function () {
            $.ajax({
                url: window.location.origin + "/Course/Create",
                type: "POST",
                async: false,
                data: {
                    "CourseDetails.PersonID": $("#person-name").val(),
                    "CourseDetails.CourseName": $("#course-name").val(),
                    "CourseDetails.CoursePlace": $("#course-place").val(),
                    "CourseDetails.DateFrom": $("#date-from").val(),
                    "CourseDetails.DateTo": $("#date-to").val(),
                    "CourseDetails.CommandItem.Number": $("#command-number").val(),
                    "CourseDetails.CommandItem.Date": $("#command-date").val()
                },
                success: function (result) {
                    if (result == -1) {
                        Swal.fire({
                            icon: 'error',
                            title: 'خطأ',
                            text: 'يوجد خطأ في تاريخ الفرقة',
                            confirmButtonText: 'موافق'
                        });
                    } else {
                        $scope.closePop(); // غلق الـ modal بعد الحفظ
                        $scope.Courses = GetCourses(); // تحديث الدورات
                        emptyFormField(); // تفريغ الحقول
                        $scope.CoursesEntered = $scope.CoursesEntered + 1;
                        setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered);

                        Swal.fire({
                            icon: 'success',
                            title: 'تم الحفظ!',
                            text: 'تمت إضافة الدورة بنجاح!',
                            confirmButtonText: 'موافق'
                        });
                    }
                }
            });
        };

        // حذف دورة
        $scope.delete = function (id) {
            Swal.fire({
                title: 'هل أنت متأكد؟',
                text: "لن تتمكن من استعادة هذه الدورة!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'نعم، احذفها!',
                cancelButtonText: 'إلغاء'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: window.location.origin + "/Course/Delete",
                        type: "POST",
                        async: false,
                        data: {
                            "id": id,
                        },
                        success: function () {
                            $scope.Courses = GetCourses();
                            $scope.CoursesEntered = $scope.CoursesEntered - 1;
                            setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered);

                            Swal.fire({
                                icon: 'success',
                                title: 'تم الحذف!',
                                text: 'تم حذف الدورة بنجاح!',
                                confirmButtonText: 'موافق'
                            });
                        }
                    });
                }
            });
        };

        // فتح النافذة المنبثقة
        $scope.openCoursePopup = function () {
            $('#courseModal').modal('show');
        };

        // غلق النافذة المنبثقة
        $scope.closePop = function () {
            $('#courseModal').modal('hide');
        };
    });
})();

function validateCourseName() {
    disableBtn();
    if ($("#course-name").val().length >= 25) {
        $("#course-name-warn").removeAttr('hidden');
    } else {
        $("#course-name-warn").attr('hidden', 'hidden');
    }
}

function setCourseAddStatus(total, entered) {
    if (total == entered) {
        $("#add-course-btn").attr('disabled', 'disabled');
    } else {
        $("#add-course-btn").removeAttr('disabled');
    }
}

function disableBtn() {
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    } else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}

function IsAllFieldsFilled() {
    return $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#course-name").val() !== "" &&
        $("#course-place").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "" &&
        $("#command-number").val() !== "" &&
        $("#command-date").val() !== "";
}

// تفريغ الحقول بعد إضافة الدورة
function emptyFormField() {
    $("#person-rank").val(null);
    $("#person-name").val(null);
    $("#course-name").val(null);
    $("#course-place").val(null);
    $("#date-from").val(null);
    $("#date-to").val(null);
    $("#command-number").val(null);
    $("#command-date").val(null);
}

function openCoursePopup() {
    $('#courseModal').modal('show');
}

function closePop() {
    $('#courseModal').modal('hide');
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#course-place").val() !== "" &&
        $("#course-place").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "" &&
        $("#command-number").val() !== "" &&
        $("#command-date").val() !== ""
    return result;
}

function GetNumbers() {
    var numbers = [];
    $.ajax({
        url: window.location.origin + "/Course/GetNumbers",
        type: "GET",
        async: false,
        success: function (result) {
            numbers = result;
        }
    })
    return numbers;
}