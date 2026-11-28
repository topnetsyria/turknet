using Microsoft.Web.WebView2.WinForms;
using Microsoft.Web.WebView2.Core;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Forms;

internal static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainWindow());
    }
}
internal sealed class MainWindow : Form
{
    const string Home = "https://turknet.live/";
    readonly WebView2 web = new() { Dock = DockStyle.Fill };
    readonly Button back = new() { Text = "رجوع", AutoSize = true, Enabled = false };
    readonly Button next = new() { Text = "التالي", AutoSize = true, Enabled = false };
    public MainWindow()
    {
        Text = "TurkNet Live"; Width = 1100; Height = 760;
        MinimumSize = new Size(420, 420);
        var bar = new FlowLayoutPanel { Dock = DockStyle.Bottom, Height = 48,
            FlowDirection = FlowDirection.RightToLeft, BackColor = Color.FromArgb(42,42,42),
            Padding = new Padding(6), WrapContents = false };
        Button Add(string label, Action action) {
            var b = new Button { Text = label, AutoSize = true };
            b.Click += (_,_) => action(); return b;
        }
        var tools = new ContextMenuStrip();
        tools.Items.Add("تحديث", null, (_,_) => web.CoreWebView2?.Reload());
        tools.Items.Add("تكبير النص", null, (_,_) => web.ZoomFactor = Math.Min(2,web.ZoomFactor + .1));
        tools.Items.Add("تصغير النص", null, (_,_) => web.ZoomFactor = Math.Max(.5,web.ZoomFactor - .1));
        tools.Items.Add("الحجم الافتراضي", null, (_,_) => web.ZoomFactor = 1);
        var menu = new Button { Text = "الأدوات", AutoSize = true };
        menu.Click += (_,_) => tools.Show(menu, new Point(0,0), ToolStripDropDownDirection.AboveLeft);
        back.Click += (_,_) => { if(web.CanGoBack) web.GoBack(); };
        next.Click += (_,_) => { if(web.CanGoForward) web.GoForward(); };
        bar.Controls.AddRange(new Control[] { Add("الرئيسية", () => web.CoreWebView2?.Navigate(Home)), back, menu,
            Add("التنزيلات", () => web.CoreWebView2?.OpenDefaultDownloadDialog()), next });
        Controls.Add(web); Controls.Add(bar);
        Shown += async (_,_) => {
            try {
                var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"TurkNetLive","WebView2");
                var env = await CoreWebView2Environment.CreateAsync(userDataFolder:path);
                await web.EnsureCoreWebView2Async(env);
                web.CoreWebView2.HistoryChanged += (_,_) => { back.Enabled = web.CanGoBack; next.Enabled = web.CanGoForward; };
                web.CoreWebView2.NewWindowRequested += (_,e) => {
                    e.Handled = true;
                    if(Uri.TryCreate(e.Uri,UriKind.Absolute,out var uri) && (uri.Scheme=="https" || uri.Scheme=="http")) {
                        if(uri.Host=="turknet.live" || uri.Host=="www.turknet.live") web.CoreWebView2.Navigate(e.Uri);
                        else Process.Start(new ProcessStartInfo(e.Uri){UseShellExecute=true});
                    }
                };
                web.CoreWebView2.Navigate(Home);
            } catch(Exception ex) { MessageBox.Show("WebView2 Runtime required.\n"+ex.Message,"TurkNet Live"); }
        };
        FormClosing += (_,e) => {
            if(MessageBox.Show("هل تريد إغلاق التطبيق؟","TurkNet Live",MessageBoxButtons.YesNo,MessageBoxIcon.Question)!=DialogResult.Yes) e.Cancel=true;
        };
    }
}