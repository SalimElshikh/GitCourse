using ElecWarSystem.Data;
using ElecWarSystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.UI.WebControls;

namespace ElecWarSystem.Serivces
{
    public class ErrandsService : IOutdoorService<Errand, ErrandDetail>
    {
        private readonly AppDBContext dBContext;
        private readonly PersonService personService;
        private readonly TmamService tmamService;
        private readonly PersonStatusService personStatusService;
        public ErrandsService()
        {
            dBContext = new AppDBContext();
            personService = new PersonService();
            tmamService = new TmamService();
            personStatusService = new PersonStatusService();
        }
        public Errand Get(long id)
        {
            Errand errand = dBContext.Errands.FirstOrDefault(row =>row.ID == id);
            return errand;
        }
        public ErrandDetail GetDetail(long id)
        {
            ErrandDetail errandDetail = dBContext.ErrandDetails.Find(id);
            return errandDetail;
        }
        public List<Errand> GetAll(int unitID)
        {
            Tmam tmam = new Tmam() { UnitID = unitID, Date = DateTime.Today.AddDays(1) };
            long tmamID = tmamService.AddTmam(tmam);
            List<Errand> errands = dBContext.Errands
                .Include("ErrandDetail")
                .Include("ErrandDetail.Person.Rank")
                .Where(row => row.TmamID == tmamID).ToList();
            return errands;
        }
        public long GetID(ErrandDetail errandDetail)
        {
            ErrandDetail errandDetailTemp =
                dBContext.ErrandDetails
                .FirstOrDefault(row => row.DateFrom == errandDetail.DateFrom &&
                    row.DateTo == errandDetail.DateTo &&
                    row.PersonID == errandDetail.PersonID);

            return errandDetailTemp?.ID ?? 0;
        }

        public long AddDetail(ErrandDetail errandDetail)
        {
            long id = GetID(errandDetail);

            if (id == 0)
            {
                dBContext.ErrandDetails.Add(errandDetail);
                id = errandDetail.ID;
            }
            else
            {
                ErrandDetail errandDetail1 = GetDetail(id);
                errandDetail1.ErrandPlace = errandDetail.ErrandPlace;
                errandDetail1.ErrandCommandor = errandDetail.ErrandCommandor;
            }
            dBContext.SaveChanges();
            return id;
        }
        public bool IsDatesLogic(Errand errand)
        {
            Tmam tmam = tmamService.GetTmam(errand.TmamID);
            bool result = errand.ErrandDetail.DateFrom <= tmam.Date &&
                errand.ErrandDetail.DateTo > tmam.Date;
            return result;
        }
        public long Add(Errand errand)
        {
            
            if (IsDatesLogic(errand))
            {
                errand.ErrandDetailID = AddDetail(errand.ErrandDetail);
                long personID = errand.ErrandDetail.PersonID;
                if(errand.ErrandDetailID != 0)
                {
                    errand.ErrandDetail = null;
                }
                dBContext.Errands.Add(errand);
                dBContext.SaveChanges();
                if (personService.PersonIsLeader(personID) != 0)
                {
                    personStatusService.setPersonStatus(new PersonStatus
                    {
                        PersonID = personID,
                        TmamID = errand.TmamID,
                        Status = TmamEnum.Errand
                    });
                }
                return errand.ID;
            }
            else
            {
                return -1;
            }
        }
        public int GetCount(long errandDetailID)
        {
            int errandCount = dBContext.Errands
                .Where(row => row.ErrandDetailID == errandDetailID)
                .Count();
            return errandCount;
        }
        public void Delete(long id)
        {
            Errand errand = Get(id);
            long errandID = errand.ErrandDetailID;
            ErrandDetail errandDetail = GetDetail(errandID);
            if (GetCount(errandID) == 1)
            {
                dBContext.ErrandDetails.Remove(errandDetail);
            }
            else
            {
                dBContext.Errands.Remove(errand);
            }
            dBContext.SaveChanges();
            personStatusService.DeletePersonStatus(errand.TmamID, errand.ErrandDetail.PersonID);
        }
        public int getTotal(int unitID)
        {
            Tmam tmam = new Tmam { UnitID = unitID, Date = DateTime.Today.AddDays(1) };
            long tmamID = tmamService.GetTmamID(tmam);
            int totalErrands = 0;
            if (tmamID > 0)
            {
                totalErrands = dBContext.TmamDetails.Where(row => row.TmamID == tmamID)?.ToList().Sum(row => row.errand) ?? 0;
            }
            return totalErrands;
        }
        public int getEntered(int unitID)
        {
            Tmam tmam = new Tmam { UnitID = unitID, Date = DateTime.Today.AddDays(1) };
            long tmamID = tmamService.GetTmamID(tmam);
            int enteredErrands = 0;
            if (tmamID > 0)
            {
                try
                {
                    enteredErrands = dBContext.Errands.Where(row => row.TmamID == tmamID).Count();
                }
                catch (Exception ex)
                {
                    enteredErrands = 0;
                }
            }
            return enteredErrands;
        }
    }
}