using System.Web;
using System.Web.Optimization;

namespace EventCalenderAng
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
#if DEBUG
            BundleTable.EnableOptimizations = true;
#else
            BundleTable.EnableOptimizations = true;
#endif
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-2.0.3.min.js",
                        "~/Scripts/Calendar/jquery-ui.min.js",
                        "~/Scripts/Calendar/moment.js",
                        "~/Scripts/angular.min.js",
                        "~/Scripts/Calendar/calendar.js",
                        "~/Scripts/Calendar/fullcalendar.js",
                        "~/Scripts/Calendar/gcal.js",
                        "~/Scripts/Calendar/angular-dragdrop.js",
                        "~/Scripts/angucomplete-alt.min.js",
                        "~/Scripts/ui-bootstrap-tpls-2.0.1.min.js",
                        "~/Scripts/alertify.min.js"
                          
                        ));
            bundles.Add(new ScriptBundle("~/bundles/Angular").Include(
                      "~/Scripts/Calendar/calApp.js"
                       ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/fullcalendar.css",
                      "~/Content/bootstrap.min.css",
                      "~/Content/angucomplete-alt.css",
                      "~/Content/fullcalendar.css",
                      "~/Content/alertify.min.css",
                        "~/Content/Site.css"));
        }
    }
}
