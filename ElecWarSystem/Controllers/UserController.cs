using ElecWarSystem.Models;
using ElecWarSystem.Serivces;
using iTextSharp.text;
using System.IO;
using System.Web;
using System.Web.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace ElecWarSystem.Controllers
{
    public class UserController : Controller
    {
        private readonly UserService userService;
        private readonly ZoneService zoneService;
        private readonly TmamService tmamService;

        public UserController()
        {
            userService = new UserService();
            zoneService = new ZoneService();
            tmamService = new TmamService();
        }
        [HttpGet]
        public ActionResult Create()
        {
            ViewBag.Zones = zoneService.GetAll();
            return View();
        }
        [HttpPost]
        public bool CreateAccount(User user, string confirmPassword)
        {
            int result = userService.CreateNewUser(user, confirmPassword);
            return (result >= 1);
        }
        // Login Action
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(FormCollection form)
        {
            string username = form["username"];
            string password = form["password"];
            User user = userService.AuthenticateUser(username, password);
            if (user != null)
            {
                Response.Cookies.Add(new HttpCookie("userID") { Value = user.Unit.ID.ToString() });
                Response.Cookies.Add(new HttpCookie("userName") { Value = username });
                Response.Cookies.Add(new HttpCookie("Roles") { Value = ((byte)user.Roles).ToString() });
                Response.Cookies.Add(new HttpCookie("unitName") { Value = user.Unit.UnitName.ToString() });
                
                if(user.Roles == UserRoles.Analyzer)
                {
                    return RedirectToAction("index", "Email");
                }
                else if ((user.Roles & UserRoles.Admin) == UserRoles.Admin ||
                    (user.Roles & UserRoles.Viewer) == UserRoles.Viewer)
                {
                    ViewBag.userName = user.UserName;
                    return RedirectToAction("LeaderShip", "TmamGathering");
                }
                else
                {
                    return RedirectToAction("Review", "Tmam");
                }
            }
            else
            {
                return RedirectToAction("Login", "User");
            }
        }

        //Logout
        [HttpGet]
        public ActionResult Logout()
        {
            Response.Cookies.Clear();
            return RedirectToAction("Login", "User");
        }
    }
}