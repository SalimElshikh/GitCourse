using ElecWarSystem.Data;
using ElecWarSystem.Models;
using ElecWarSystem.Serivces;
using ElecWarSystem.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using Reciever = ElecWarSystem.Models.Reciever;
using Microsoft.Ajax.Utilities;
using static System.Web.Razor.Parser.SyntaxConstants;
using iText.Kernel.Geom;

namespace ElecWarSystem.Controllers
{
    public class EmailController : Controller
    {
        private readonly AppDBContext dBContext;
        private readonly UserService userService;
        private readonly EmailService emailService;
        private readonly StorageManager storageManager;
        private String[] dangerExtension;
        public EmailController()
        {
            dBContext = new AppDBContext();
            userService = new UserService();
            emailService = new EmailService();
            storageManager = new StorageManager();
            dangerExtension = new[]{ "pdf", "dot", "dotx", "docm", "docx",
                "doc", "png", "jpeg", "jpg", "tif","pptx","pptm",
                "ppt", "potx", "accdb", "mdb", "xlsx", "xls", "xlsm",
                "csv", "zip", "rar", "mp3","aac", "oog", "wav", "mp4", 
                "mov", "wmv", "avi", "mkv"};
            
                 
        }
        // GET: Emails
        public ActionResult Index()
        {
            if (Request.Cookies["userID"] != null)
            {
                int unitId = int.Parse(Request.Cookies["userID"].Value);
                ViewBag.Capacity = storageManager.getCapacityPerUnit(unitId);
                ViewBag.Used = storageManager.getUsedPerUnit(unitId);
                return View();
            }
            else
            {
                return RedirectToAction("Login", "User");
            }
        }
        public JsonResult GetEmails(bool export)
        {
            if (Request.Cookies["userID"] != null)
            {
                int userId = int.Parse(Request.Cookies["userID"].Value);
                if (export)
                {
                    List<Email> emails = emailService.GetExportedEmails(userId);
                    return Json(emails, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    List<Reciever> recievers = emailService.GetRecievers(userId);
                    return Json(recievers, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json("UnAuthorized Request!");
            }
        }

        // GET: Email/Details/5
        public ActionResult Details(int id)
        {
            Email email = dBContext.Emails.Include("Documents").Include("Recievers.RecieverUser").Include("Sender").FirstOrDefault(row => row.ID == id);

            int userId = int.Parse(Request.Cookies["userID"].Value);
            Reciever reciever = email.Recievers.FirstOrDefault(row => row.RecieverID == userId);
            if (reciever != null)
            {
                if (!reciever.Readed)
                {
                    reciever.Readed = true;
                    dBContext.SaveChanges();
                }
            }
            return View(email);
        }

        // GET: Email/Create
        public ActionResult Create()
        {
            EmailViewModel emailViewModel = new EmailViewModel();
            emailViewModel.Email = new Email();
            return View(emailViewModel);
        }
        [HttpGet]
        public JsonResult CountOfUnReadEmails()
        {
            int userId = int.Parse(Request.Cookies["userID"]?.Value);
            int unreadCount = emailService.GetCountOfUnReadEmails(userId);
            return Json(unreadCount, JsonRequestBehavior.AllowGet);
        }
        // POST: Email/Create
        [HttpPost]
        public ActionResult Create(EmailViewModel emailViewModel, IEnumerable<HttpPostedFileBase> files)
        {
            int userId = int.Parse(Request.Cookies["userID"]?.Value);
            emailViewModel.Email.Documents = new List<Document>();
            emailViewModel.Email.SenderUserID = int.Parse(Request.Cookies["userID"].Value);
            emailViewModel.Email.SendDateTime = DateTime.Now;

            List<HttpPostedFileBase> attachment = files.ToList();
            string serverPath = @"D:\\FileShare";
            long allContentSize = 0;

            foreach (string id in emailViewModel.RecIds)
            {
                emailViewModel.Email.Recievers.Add(new Models.Reciever() { RecieverID = int.Parse(id) });
            }

            Dictionary<string, HttpPostedFileBase> filePaths = new Dictionary<string, HttpPostedFileBase>();

            foreach (HttpPostedFileBase file in attachment)
            {
                Guid guid = Guid.NewGuid();
                String fileName = file.FileName;
                string[] fileAtt = fileName.Split('.');
                if (!dangerExtension.Contains(fileAtt.Last()))
                {
                    emailViewModel.Message = $"عفواً لا يمكنك إرسال ملفات بإمتداد ({fileAtt.Last()}) حسب تعليمات الأمن السيبرانى";
                    return View(emailViewModel);
                }
                else
                {
                    string filePath = String.Format("{0}\\{1}.{2}", serverPath, guid, fileAtt.Last());
                    allContentSize += file.ContentLength;
                    filePaths[filePath] = file;
                    emailViewModel.Email.Documents.Add(new Document
                    {
                        FileName = fileAtt[0],
                        FileExtension = fileAtt.Last(),
                        FilePath = filePath
                    });
                }
            }

            if (storageManager.increaseUsed(userId, allContentSize))
            {
                dBContext.Emails.Add(emailViewModel.Email);
                dBContext.SaveChanges();
                foreach (var filepath in filePaths)
                {
                    filepath.Value.SaveAs(filepath.Key);
                }
                return RedirectToAction("Index", "Email");
            }
            else
            {
                emailViewModel.Message = "عفواً المساحة المتاحة لك لا تكفى!!";
                return View(emailViewModel);
            }            
        }

        [HttpPost]
        public void StarEmail(int id)
        {
            int userID = int.Parse(Request.Cookies["userID"].Value);
            Reciever reciever = dBContext.Recievers.FirstOrDefault(row => row.EmailID == id && row.RecieverID == userID);
            reciever.Starred = !reciever.Starred;
            dBContext.SaveChanges();
        }

        // POST: Email/Delete/5
        [HttpPost]
        public JsonResult Delete(int id)
        {
            int status = 0;
            if (Request.Cookies["userID"]?.Value != null)
            {
                int userId = int.Parse(Request.Cookies["userID"]?.Value);
                long contentSize = 0;
                Email email = dBContext.Emails.Include("Documents").FirstOrDefault(row => row.SenderUserID == userId && row.ID == id);
                foreach (Document document in email?.Documents)
                {
                    if (System.IO.File.Exists($@"{document.FilePath}"))
                    {
                        contentSize += new FileInfo(document.FilePath).Length; //System.IO.File.ReadAllBytes().Length;
                        System.IO.File.Delete($@"{document.FilePath}");
                    }
                }
                dBContext.Emails.Remove(email);
                dBContext.SaveChanges();
                storageManager.decreaseUsed(userId, contentSize);
                status = 200;
            }
            else
            {
                status = 404;
            }
            return Json(status, JsonRequestBehavior.AllowGet);
        }
    }
}