using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(EventCalenderAng.Startup))]
namespace EventCalenderAng
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
