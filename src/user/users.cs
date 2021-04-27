using System;
using System.Data;
using System.Data.Odbc;
using System.Collections.Generic;

public partial class clUser : System.Web.UI.Page{

   OdbcConnection cn = null;
   static string sCon="DSN=prod;UID=lej;PWD=lej;";

   public clUser(){
		 try{cn=new OdbcConnection(sCon);}
		 catch(Exception e){cn=null;}}
		 ~clUser(){if(cn!=null){cn.Close();}}

   protected string getAddr(){
		 string sAdr=Request.ServerVariables["REMOTE_ADDR"];
		 return sAdr;
   }
   
   protected string getUserID(){
		 string sUser=Request.ServerVariables["REMOTE_USER"];
		 string sT=sUser.ToLower();
		 sUser=sT.Replace("leinternal\\","");
		 return sUser;
   }
   
   protected string getUserName(string sID){
	  string sName="";
	  if(cn==null){return sName;}
      string sSQL="select (he_lstn_jp || ' ' || he_frsn_jp) as nmjp,(he_frsn_en || ' ' || he_lstn_en) as nmen from hr_empl where he_win_id='" + sID + "'";
	  OdbcCommand cmd=new OdbcCommand(sSQL,cn);
	  cn.Open();
	  OdbcDataReader rd=cmd.ExecuteReader();
	  if(rd.HasRows){sName=rd.GetString(rd.GetOrdinal("nmjp"));if(sName.Trim()==""){sName=rd.GetString(rd.GetOrdinal("nmen"));}}
	  rd.Close();
	  cn.Close();
	  return sName.Trim();
   }

}