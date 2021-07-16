using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace coronaWeb.Pages
{
    public class ReportModel : PageModel
    {
        private readonly ILogger<ReportModel> _logger;

        public ReportModel(ILogger<ReportModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {
        }
    }
}
