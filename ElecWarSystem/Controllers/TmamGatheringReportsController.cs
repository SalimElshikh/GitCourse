using ElecWarSystem.Models;
using ElecWarSystem.ReportFactory;
using ElecWarSystem.Serivces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ElecWarSystem.Controllers
{
    public class TmamGatheringReportsController : Controller
    {
        private TmamGatheringService tmamGatheringService;
        private DateTime dateTmam;
        private string title;
        public TmamGatheringReportsController()
        {
            tmamGatheringService = new TmamGatheringService();
            dateTmam = DateTime.Today.AddDays(1);
        }
        public void initViewer()
        {
            UserRoles userRoles = (UserRoles)byte.Parse(Request.Cookies["Roles"].Value);

            if ((userRoles & UserRoles.Viewer) == UserRoles.Viewer &&
                    (userRoles & UserRoles.Admin) != UserRoles.Admin)
            {
                this.dateTmam = DateTime.Today;
                tmamGatheringService = new TmamGatheringService(this.dateTmam);
            }
        }
        public ActionResult LeadersTmamReport()
        {
            initViewer();
            var sickLeavesTmam = tmamGatheringService.GetSickLeavesTmam();
            this.title = "القادة";
            LeadersTmamReport leadersTmamReport = new LeadersTmamReport(tmamGatheringService.GetAllLeaderTmam(), dateTmam, this.title);
            leadersTmamReport.SetAltCommandors(tmamGatheringService.GetAllAltCommandor());
            byte[] bytes = leadersTmamReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        // GET: TmamGatheringReports
        public ActionResult OfficerTmamReport()
        {
            initViewer();
            Dictionary<String, List<TmamDetail>> officersTmamList = tmamGatheringService.GetOfficersTmam(IsOfficers: true);
            this.title = "الضباط";
            PersonsTmamReport personsTmamReport = new PersonsTmamReport(officersTmamList, this.dateTmam, this.title);
            byte[] bytes = personsTmamReport.PrepareReport();
            return File(bytes, "application/pdf", $"تمام {this.title}.pdf");
        }
        public ActionResult NonOfficerTmamReport()
        {
            initViewer();
            Dictionary<String, List<TmamDetail>> officersTmamList = tmamGatheringService.GetOfficersTmam(IsOfficers: false);
            this.title = "الدرجات الأخرى";
            PersonsTmamReport personsTmamReport = new PersonsTmamReport(officersTmamList, this.dateTmam, this.title);
            byte[] bytes = personsTmamReport.PrepareReport();
            return File(bytes, "application/pdf", $"تمام {this.title}.pdf");
        }
        public ActionResult ErrandsReport()
        {
            initViewer();
            var errandsTmam = tmamGatheringService.GetErrandsTmam();
            this.title = "المأموريات";
            ErrandsReport errandReport = new ErrandsReport(errandsTmam, this.dateTmam, this.title);
            byte[] bytes = errandReport.PrepareReport();

            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult SickLeavesReport()
        {
            initViewer();
            var sickLeavesTmam = tmamGatheringService.GetSickLeavesTmam();
            this.title = "الأجازات المرضية";
            SickLeaveReport sickLeaveReport = new SickLeaveReport(sickLeavesTmam, this.dateTmam, this.title);
            byte[] bytes = sickLeaveReport.PrepareReport();

            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult HospitalsReport()
        {
            initViewer();
            var hospitalsTmam = tmamGatheringService.GetHospitalsTmam();
            this.title = "المستشفيات";
            HospitalsReport hospitalReport = new HospitalsReport(hospitalsTmam, this.dateTmam, $"الضباط  و الأفراد المحجوزين ب{this.title}");
            byte[] bytes = hospitalReport.PrepareReport();

            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }

        public ActionResult PrisonsReport()
        {
            initViewer();
            var prisonsTmam = tmamGatheringService.GetPrisonsTmam();
            this.title = "السجن";
            PrisonsReport prisonReport = new PrisonsReport(prisonsTmam, this.dateTmam, "الأفراد(السجن/الحبس)");
            byte[] bytes = prisonReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult AbsencesReport()
        {
            initViewer();
            var absencesTmam = tmamGatheringService.GetAbsencesTmam();
            this.title = "الغياب";
            AbsencesReport absenceReport = new AbsencesReport(absencesTmam, this.dateTmam, $"الأفراد {this.title}");
            byte[] bytes = absenceReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult OutOfCountriesReport()
        {
            initViewer();
            var OutOfCountriesTmam = tmamGatheringService.GetOutOfCountriesTmam();
            this.title = "خارج البلاد";
            OutOfCountriesReport outOfCountriesReport = new OutOfCountriesReport(OutOfCountriesTmam, this.dateTmam, $"الضباط و الأفراد المسافرين {this.title}");
            byte[] bytes = outOfCountriesReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult CampsReport()
        {
            initViewer();
            var CampsTmam = tmamGatheringService.GetCampsTmam();
            this.title = "خارج التمركز";
            CampsReport CampsReport = new CampsReport(CampsTmam, this.dateTmam, $"الضباط و الأفراد المتواجدين {this.title}");
            byte[] bytes = CampsReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
        public ActionResult CoursesReport()
        {
            initViewer();
            var CoursesTmam = tmamGatheringService.GetCoursesTmam();
            this.title = "الفرق و الدورات";
            CoursesReport CoursesReport = new CoursesReport(CoursesTmam, this.dateTmam, this.title);
            byte[] bytes = CoursesReport.PrepareReport();
            return File(bytes, "application/pdf", $"{this.title}.pdf");
        }
    }
}