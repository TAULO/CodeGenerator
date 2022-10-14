/*
Copyright 2002-2019 Intel Corporation.

This software and the related documents are Intel copyrighted materials, and
your use of them is governed by the express license under which they were
provided to you (License). Unless the License provides otherwise, you may not
use, modify, copy, publish, distribute, disclose or transmit this software or
the related documents without Intel's prior written permission.

This software and the related documents are provided as is, with no express or
implied warranties, other than those that are expressly stated in the License.
*/

/*
Visual Studio processing.

function GetVSInfo returns object where key is VS identification:
    vs_2002, vs_2003, vs_2005, vs_2008, vs_2010, vs_2012

value is object with attributes (on example for vs_2008 object):

    vs_2008.id = "vs_2008"; // example
    vs_2008.name = "Microsoft Visual Studio* 2008 software"; // example
    vs_2008.dir = product directory
    vs_2008.devenv = devenv executable path
    vs_2008.sh_dir = shell directory
    vs_2008.sp = service pack identifier
    vs_2008.dexplore = dexplore, boolean
    vs_2008.csharp = CSharp, boolean
    vs_2008.vb = VB, boolean
    vs_2008.cpp = CPP, boolean
    vs_2008.vb_expr = VB Express, boolean
    vs_2008.cpp_expr = CPP Express, boolean
    vs_2008.csharp_expr = CSharp Express, boolean
    vs_2008.vwd_expr = VWD Express ???, bolean
    vs_2008.Running - function(), returns true if corresponding devenv.exe process is running
*/

new function()
{
    var is_running = function(image)
    {
        if(!image)
            return false;

        if(!FileSystem.Exists(image))
            return false;

        var p_list = System.ProcessList();

        for(var i in p_list)
        {
            var proc = p_list[i];
            if(FileSystem.Exists(proc) && FileSystem.Same(proc, image))
                return true;
        }
        return false;
    }
    var is_running_under_another_user = function(vs_image_list)
    {
        Log("Check if vs is running under another user");
        
        if(!vs_image_list || !vs_image_list.length)
            return false;

        var p_list = System.ProcessList();

        for(var i in p_list)
        {
            var proc = p_list[i];
            Log("Process list under another user " + proc);
            for (var il in vs_image_list)
                if(FileSystem.FileName(vs_image_list[il]) == proc)
                    return true;
        }
        return false;
    }
    var add_common_info = function(fill_stud)
    {
        var l_images = [];
        for (var s in fill_stud)
        {
            if(fill_stud[s].hasOwnProperty("instances"))
            {
                for (var i in fill_stud[s].instances)
                {
                    var ints = fill_stud[s].instances[i];
                    l_images.push(FileSystem.MakePath(ints.product_path, ints.install_path));
                }
            }
            else
            {
                if (typeof(fill_stud[s].devenv) != "undefined")
                    l_images.push(fill_stud[s].devenv);
            }
        }
        fill_stud.RunningUnderAnotherUser = function(){return is_running_under_another_user(l_images);}
    }

    var intersect = function(a, b) 
    {
        var d = {};
        var results = [];
        for (var i = 0, k = b.length; i < k; i++) 
        {
            d[b[i]] = true;
        }
        for (var j = 0, l = a.length; j < l; j++)
        {
            if (d[a[j]]) 
                results.push(a[j]);
        }
        return results;
    }
    
    //Function is used for VS2017 (and later?) to check installed packages for some VS instance.
    var is_installed = function(instance, packages)
    {
        if (packages.length == 0)
            return false;
        var pkgs = [];

        if(packages instanceof Array)
            pkgs = packages.map(function(x){ if (x && x.toUpperCase) {return x.toUpperCase();}});
        else
            pkgs.push(packages.toUpperCase());
        
        var ins_pkgs = [];
        for (var i in instance.packages)
        {
            ins_pkgs.push(instance.packages[i].id.toUpperCase());
        }
        var isect = intersect(ins_pkgs, pkgs);
        return isect.length == pkgs.length;
    }

    var vs_2002 = {};
    vs_2002.id = "vs_2002";
    vs_2002.name = "Microsoft Visual Studio* 2002 software";
    vs_2002.data = {};
    vs_2002.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\7.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2002.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\7.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2002.Running = function(){return is_running(vs_2002.devenv);}

    var vs_2003 = {};
    vs_2003.id = "vs_2003";
    vs_2003.name = "Microsoft Visual Studio* 2003 software"
    vs_2003.data = {};
    vs_2003.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\7.1\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2003.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\7.1\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2003.Running = function(){return is_running(vs_2003.devenv);}

    var vs_2005 = {};
    vs_2005.id = "vs_2005";
    vs_2005.name = "Microsoft Visual Studio* 2005 software"
    vs_2005.data = {};
    vs_2005.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2005.data.sp = {key:"SOFTWARE\\Microsoft\\DevDiv\\VS\\Servicing\\8.0", value:"SP", type:"value"};
    vs_2005.data.ppe_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Setup\\VS\\IDE", value:"ProductDir", type:"directory"};
    vs_2005.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2005.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2005.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2005.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\8.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2005.data.dexplore = {key:"Software\\Microsoft\\DExplore\\v2.0.50727\\1033", value:"Install", type:"boolean"};
    vs_2005.data.vb_expr = {key:"Software\\Microsoft\\VBExpress\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.data.csharp_expr = {key:"Software\\Microsoft\\VCSExpress\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.data.vwd_expr = {key:"Software\\Microsoft\\VWDExpress\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.data.vjsh_expr = {key:"Software\\Microsoft\\VJSExpress\\8.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2005.Running = function(){return is_running(vs_2005.devenv);}

    var vs_2008 = {};
    vs_2008.id = "vs_2008";
    vs_2008.name = "Microsoft Visual Studio* 2008 software"
    vs_2008.data = {};
    vs_2008.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2008.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2008.data.sh_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Setup\\VS\\IDE", value:"ProductDir", type:"directory"};
    vs_2008.data.sp = {key:"SOFTWARE\\Microsoft\\DevDiv\\VS\\Servicing\\9.0", value:"SP", type:"value"};
    vs_2008.data.dexplore = {key:"Software\\Microsoft\\DExplore\\v9.0.21022\\1033", value:"Install", type:"boolean"};
    vs_2008.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2008.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2008.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2008.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\9.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2008.data.vb_expr = {key:"Software\\Microsoft\\VBExpress\\9.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2008.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\9.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2008.data.csharp_expr = {key:"Software\\Microsoft\\VCSExpress\\9.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2008.data.vwd_expr = {key:"Software\\Microsoft\\VWDExpress\\9.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2008.Running = function(){return is_running(vs_2008.devenv);}

    var vs_2010 = {};
    vs_2010.id = "vs_2010";
    vs_2010.name = "Microsoft Visual Studio* 2010 software"
    vs_2010.data = {};
    vs_2010.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2010.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2010.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2010.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"value"};
    vs_2010.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"value"};
    vs_2010.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2010.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\10.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2010.data.shell = {key:"SOFTWARE\\Microsoft\\VisualStudio\\10.0\\Setup\\IntShell", value:"ProductDir", type:"subkey_dir"};
    vs_2010.Running = function(){return is_running(vs_2010.devenv);}
    vs_2010.TargetArch = {};
    vs_2010.TargetArch.x86 = function(){return FileSystem.Exists(vs_2010.cpp_dir + "\\bin\\vcvars32.bat");}
    vs_2010.TargetArch.amd64 = function(){return FileSystem.Exists(vs_2010.cpp_dir + "\\bin\\amd64\\vcvars64.bat");}
    vs_2010.TargetArch.ia64 = function(){return FileSystem.Exists(vs_2010.cpp_dir + "\\bin\\ia64\\vcvars64.bat");}
    vs_2010.TargetArch.x86_amd64 = function(){return FileSystem.Exists(vs_2010.cpp_dir + "\\bin\\x86_amd64\\vcvarsx86_amd64.bat");}
    vs_2010.TargetArch.x86_ia64 = function(){return FileSystem.Exists(vs_2010.cpp_dir + "\\bin\\x86_ia64\\vcvarsx86_ia64.bat");}

    var vs_2012 = {};
    vs_2012.id = "vs_2012";
    vs_2012.name = "Microsoft Visual Studio* 2012 software"
    vs_2012.data = {};
    vs_2012.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2012.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2012.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2012.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"value"};
    vs_2012.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"value"};
    vs_2012.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2012.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\11.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    // TODO: the key below is created by VS Express installer, key above is NOT created... line above contain error?
    vs_2012.data.vc_expr = {key:"Software\\Microsoft\\VCExpress\\11.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2012.data.wd_expr = {key:"Software\\Microsoft\\WDExpress\\11.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2012.data.shell = {key:"SOFTWARE\\Microsoft\\VisualStudio\\11.0\\Setup\\IntShell", value:"ProductDir", type:"subkey_dir"};
    vs_2012.Running = function(){return is_running(vs_2012.devenv);}
    vs_2012.TargetArch = {};
    vs_2012.TargetArch.x86 = function(){return FileSystem.Exists(vs_2012.cpp_dir + "\\bin\\vcvars32.bat");}
    vs_2012.TargetArch.amd64 = function(){return FileSystem.Exists(vs_2012.cpp_dir + "\\bin\\amd64\\vcvars64.bat");}
    vs_2012.TargetArch.ia64 = function(){return FileSystem.Exists(vs_2012.cpp_dir + "\\bin\\ia64\\vcvars64.bat");}
    vs_2012.TargetArch.x86_amd64 = function(){return FileSystem.Exists(vs_2012.cpp_dir + "\\bin\\x86_amd64\\vcvarsx86_amd64.bat");}
    vs_2012.TargetArch.x86_ia64 = function(){return FileSystem.Exists(vs_2012.cpp_dir + "\\bin\\x86_ia64\\vcvarsx86_ia64.bat");}

    var vs_2013 = {};
    vs_2013.id = "vs_2013";
    vs_2013.name = "Microsoft Visual Studio* 2013 software"
    vs_2013.data = {};
    vs_2013.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2013.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2013.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2013.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"value"};
    vs_2013.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"value"};
    vs_2013.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2013.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\12.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    // TODO: the key below is created by VS Express installer, key above is NOT created... line above contain error?
    vs_2013.data.vc_expr = {key:"Software\\Microsoft\\VCExpress\\12.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2013.data.wd_expr = {key:"Software\\Microsoft\\WDExpress\\12.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2013.data.shell = {key:"SOFTWARE\\Microsoft\\VisualStudio\\12.0\\Setup\\IntShell", value:"ProductDir", type:"subkey_dir"};
    vs_2013.data.shell_isolated = {key:"SOFTWARE\\Microsoft\\DevDiv\\vs\\Servicing\\12.0\\isoshell", value:"Install", type:"value"};
    vs_2013.data.shell_integrated = {key:"SOFTWARE\\Microsoft\\DevDiv\\vs\\Servicing\\12.0\\intshelladditionalres", value:"Install", type:"subkey_value"};
    vs_2013.data.shell_remote_tools = {key:"SOFTWARE\\Microsoft\\DevDiv\\rdbg\\Servicing\\12.0\\std", value:"Install", type:"subkey_value"};
    vs_2013.Running = function(){return is_running(vs_2013.devenv);}
    vs_2013.TargetArch = {};
    vs_2013.TargetArch.x86 = function(){return FileSystem.Exists(vs_2013.cpp_dir + "\\bin\\vcvars32.bat");}
    vs_2013.TargetArch.amd64 = function(){return FileSystem.Exists(vs_2013.cpp_dir + "\\bin\\amd64\\vcvars64.bat");}
    vs_2013.TargetArch.ia64 = function(){return FileSystem.Exists(vs_2013.cpp_dir + "\\bin\\ia64\\vcvars64.bat");}
    vs_2013.TargetArch.x86_amd64 = function(){return FileSystem.Exists(vs_2013.cpp_dir + "\\bin\\x86_amd64\\vcvarsx86_amd64.bat");}
    vs_2013.TargetArch.x86_ia64 = function(){return FileSystem.Exists(vs_2013.cpp_dir + "\\bin\\x86_ia64\\vcvarsx86_ia64.bat");}

    var vs_2015 = {};
    vs_2015.id = "vs_2015";
    vs_2015.name = "Microsoft Visual Studio* 2015 software"
    vs_2015.data = {};
    vs_2015.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2015.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2015.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2015.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"value"};
    vs_2015.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"value"};
    vs_2015.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2015.data.cpp_expr = {key:"Software\\Microsoft\\VCExpress\\14.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    // TODO: the key below is created by VS Express installer, key above is NOT created... line above contain error?
    vs_2015.data.vc_expr = {key:"Software\\Microsoft\\VCExpress\\14.0\\Setup\\VC", value:"ProductDir", type:"directory"};
    vs_2015.data.wd_expr = {key:"Software\\Microsoft\\WDExpress\\14.0\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2015.data.shell = {key:"SOFTWARE\\Microsoft\\VisualStudio\\14.0\\Setup\\IntShell", value:"ProductDir", type:"subkey_dir"};
    vs_2015.data.shell_isolated = {key:"SOFTWARE\\Microsoft\\DevDiv\\vs\\Servicing\\14.0\\isoshell", value:"Install", type:"value"};
    vs_2015.data.shell_integrated = {key:"SOFTWARE\\Microsoft\\DevDiv\\vs\\Servicing\\14.0\\intshelladditionalres", value:"Install", type:"subkey_value"};
    vs_2015.data.shell_remote_tools = {key:"SOFTWARE\\Microsoft\\DevDiv\\rdbg\\Servicing\\14.0\\std", value:"Install", type:"subkey_value"};
    vs_2015.Running = function(){return is_running(vs_2015.devenv);}
    vs_2015.TargetArch = {};
    vs_2015.TargetArch.x86 = function(){return FileSystem.Exists(vs_2015.cpp_dir + "\\bin\\vcvars32.bat");}
    vs_2015.TargetArch.amd64 = function(){return FileSystem.Exists(vs_2015.cpp_dir + "\\bin\\amd64\\vcvars64.bat");}
    vs_2015.TargetArch.ia64 = function(){return FileSystem.Exists(vs_2015.cpp_dir + "\\bin\\ia64\\vcvars64.bat");}
    vs_2015.TargetArch.x86_amd64 = function(){return FileSystem.Exists(vs_2015.cpp_dir + "\\bin\\x86_amd64\\vcvarsx86_amd64.bat");}
    vs_2015.TargetArch.x86_ia64 = function(){return FileSystem.Exists(vs_2015.cpp_dir + "\\bin\\x86_ia64\\vcvarsx86_ia64.bat");}
    
    var vs_2017 = {};
    vs_2017.id = "vs_2017";
    vs_2017.name = "Microsoft Visual Studio* 2017 software"
    vs_2017.data = {};
    vs_2017.data.dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Setup\\VS", value:"ProductDir", type:"directory"};
    vs_2017.data.devenv = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Setup\\VS", value:"EnvironmentPath", type:"file"};
    vs_2017.data.csharp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Projects\\{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}", value:"DefaultProjectExtension", type:"boolean"};
    vs_2017.data.vb = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Projects\\{F184B08F-C81C-45f6-A57F-5ABD9991F28F}", value:"DefaultProjectExtension", type:"value"};
    vs_2017.data.cpp = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Projects\\{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}", value:"DefaultProjectExtension", type:"value",
        pkgs: ["Microsoft.VisualStudio.Component.VC.CoreIde"]};
    vs_2017.data.cpp_dir = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Setup\\VC", value:"ProductDir", type:"directory", 
    fnc: function () {
        if(vs_2017.cpp || vs_2017.FilterInstances(vs_2017.data.cpp.pkgs))
            return vs_2017.dir;
    }};
    vs_2017.data.shell = {key:"SOFTWARE\\Microsoft\\VisualStudio\\15.0_%id_Config\\Setup\\IntShell", value:"ProductDir", type:"directory"};
    vs_2017.data.cpp_android_30_dir = {type:"directory", 
    fnc: function () {
        for (var i in vs_2017.instances)
        {
            // Android\3.0\Default.props comes from "Microsoft.VisualStudio.VC.Ide.Android" package
            if(is_installed(vs_2017.instances[i], vs_2017.data.cpp.pkgs /*["Microsoft.VisualStudio.Component.VC.CoreIde", "Microsoft.VisualStudio.VC.Ide.Android"]*/) && 
               FileSystem.Exists(FileSystem.MakePath("\\Common7\\IDE\\VC\\VCTargets\\Application Type\\Android\\3.0\\Default.props", vs_2017.instances[i].install_path)))
            {
                Log("cpp_android_30_dir: " + vs_2017.instances[i].install_path);
                return vs_2017.instances[i].install_path;
            }
        }
    }};
    
    vs_2017.data.build_tools_dir =  {type:"directory", fnc: function () 
        {
            for (var i in vs_2017.instances)
            {
                if(vs_2017.instances[i].product && vs_2017.instances[i].product.match("Product.BuildTools"))
                {
                    return vs_2017.instances[i].install_path;
                }
            }
        }
    }
    
    vs_2017.data.build_tools_cpp  =  {type:"boolean", fnc: function () 
        {
            for (var i in vs_2017.instances)
            {
                if(vs_2017.instances[i].product && vs_2017.instances[i].product.match("Product.BuildTools") && is_installed(vs_2017.instances[i],["Microsoft.VisualCpp.Tools.Core.x86"]))
                {
                    return true;
                }
            }
            return false;
        }
    };
    
    vs_2017.TargetArch = {};
    vs_2017.TargetArch.x86 = function(){return FileSystem.Exists(vs_2017.dir + "\\VC\\Auxiliary\\Build\\vcvars32.bat");}
    vs_2017.TargetArch.amd64 = function(){return FileSystem.Exists(vs_2017.dir + "\\VC\\Auxiliary\\Build\\vcvars64.bat");}
    vs_2017.TargetArch.ia64 = function(){return null;}
    vs_2017.TargetArch.x86_amd64 = function(){return FileSystem.Exists(vs_2017.dir + "\\VC\\Auxiliary\\Build\\vcvarsx86_amd64.bat");}
    vs_2017.TargetArch.x86_ia64 = function(){return null;}
    
    vs_2017.privateregistry = FileSystem.SpecialFolder.user_local_app_data + "\\Microsoft\\VisualStudio\\15.0_%id\\privateregistry.bin";
    vs_2017.ver = "15.";
    vs_2017.instances = [];

    //Check for package(s) installed at least in one VS instance
    vs_2017.FilterInstances = function ()
    {
        var args = [].slice.call(arguments);
        args = [].concat.apply([], args);
        for (var i in vs_2017.instances)
        {
            if(is_installed(vs_2017.instances[i], args))
            {
                Log("Packages " + JSON.stringify(args) + " installed into VS2017 " + vs_2017.instances[i].id);
                return true;
            }
        }
        return false;
    }

    vs_2017.Running = function()
    {
        for (var i in vs_2017.instances)
        {
            var ints = vs_2017.instances[i];
            if(VSSetupConfig.IsLaunchable(ints.id) && is_running(FileSystem.MakePath(ints.product_path, ints.install_path)))
            {
                Log("VS instance: " + ints.id + " (" + ints.version + ") " + "is running: " + FileSystem.MakePath(ints.product_path, ints.install_path));
                return true;
            }
        }
        return false;
    }

    var sdk_80 = {};
    sdk_80.id = "sdk_80";
    sdk_80.name = "Microsoft Windows SDK for Windows 8.0*"
    sdk_80.data = {};
    sdk_80.data.dir = {key:"SOFTWARE\\Microsoft\\Microsoft SDKs\\Windows\\v8.0", value:"InstallationFolder", type:"directory"};

    var sdk_81 = {};
    sdk_81.id = "sdk_81";
    sdk_81.name = "Microsoft Windows SDK for Windows 8.1*"
    sdk_81.data = {};
    sdk_81.data.dir = {key:"SOFTWARE\\Microsoft\\Microsoft SDKs\\Windows\\v8.1", value:"InstallationFolder", type:"directory"};

    var sdk_100 = {};
    sdk_100.id = "sdk_100";
    sdk_100.name = "Microsoft Windows SDK for Windows 10.0*"
    sdk_100.data = {};
    sdk_100.data.dir = {key:"SOFTWARE\\Microsoft\\Microsoft SDKs\\Windows\\v10.0", value:"InstallationFolder", type:"directory"};

    var find = function(array, val)
    {
        for(var i in array)
            if(array[i] == val)
                return true;
        return false;
    }

    var stud = {vs_2002:vs_2002, vs_2003:vs_2003, vs_2005:vs_2005, vs_2008:vs_2008, vs_2010:vs_2010, vs_2012:vs_2012, vs_2013:vs_2013, vs_2015:vs_2015, vs_2017:vs_2017, sdk_80:sdk_80, sdk_81:sdk_81, sdk_100:sdk_100};

    var fill = function(studios)
    {
        for(var i in studios)
        {
            var iter = studios[i];

            Log("Processing: " + iter.id + ": " + iter.name);

            var data = iter.data;
            
            if(iter.hasOwnProperty("instances") && typeof(VSSetupConfig) != "undefined")
            {
                Log("Trying to load all installed instances.");
                var ids = VSSetupConfig.GetIds();
                for(var i = 0; i < ids.length; i++)
                {
                    var instance = {};
                    instance.id = ids[i];
                    instance.state        = VSSetupConfig.GetState(ids[i]);
                    instance.install_date = VSSetupConfig.GetInstallDate(ids[i]);
                    instance.install_path = VSSetupConfig.GetInstallationPath(ids[i]);
                    instance.name         = VSSetupConfig.GetInstallationName(ids[i]);
                    instance.version      = VSSetupConfig.GetInstallationVersion(ids[i]);
                    instance.description  = VSSetupConfig.GetDescription(ids[i]);
                    instance.display_name = VSSetupConfig.GetDisplayName(ids[i]);
                    instance.product      = VSSetupConfig.GetProduct(ids[i]);
                    instance.product_path = VSSetupConfig.GetProductPath(ids[i]);
                    try 
                    {
                        instance.packages = JSON.parse(VSSetupConfig.GetPackages(ids[i]));
                    }
                    catch(e)
                    {
                        Log(Log.l_error, "VSSetupConfig.GetPackages: Exception handled parsing packages.");
                    }
                    
                    if(instance.version.indexOf(iter.ver) == 0)
                    {
                        if(VSSetupConfig.IsComplete(ids[i]))
                        {
                            iter.instances.push(instance);
                            iter.dir = instance.install_path;
                            iter.devenv = FileSystem.MakePath(instance.product_path, instance.install_path);
                        }
                        
                        /* initialize string list from Visual Studio instance
                        StringList.Replace(vs_2017.id, instance.display_name + " (" + instance.id + ")");
                        StringList.Replace(vs_2017.id + "_description", instance.description);
                        StringList.Replace(vs_2017.id + "_label", instance.name + " (" + instance.version + ") - " + instance.state);
                        */
                        
                        var InstanceState = function (state) 
                        {
                            var s = [] ;
                            if(state & VSSetupConfig.InstanceStateNone)
                            {
                                s.push("None");
                            }
                            if(state & VSSetupConfig.InstanceStateLocal)
                            {
                                s.push("Local");
                            }
                            if(state & VSSetupConfig.InstanceStateRegistred)
                            {
                                s.push("Registered");
                            }
                            if(state & VSSetupConfig.InstanceStateNoRebootRequired)
                            {
                                s.push("NoRebootRequired");
                            }
                            if(state & VSSetupConfig.InstanceStateNoErrors)
                            {
                                s.push("NoErrors");
                            }
                            if(state & VSSetupConfig.InstanceStateComplete)
                            {
                                s.push("Complete");
                            }
                            return JSON.stringify(s);
                        };
                        
                        // debug 1: print instance values
                        Log(FileSystem.MakePath(instance.product_path, instance.install_path));
                        Log("__________________________________");
                        Log("                    ID: " + ids[i]);
                        Log("                 State: " + InstanceState(VSSetupConfig.GetState(ids[i])));
                        Log("           InstallDate: " + VSSetupConfig.GetInstallDate(ids[i]));
                        Log("      InstallationName: " + VSSetupConfig.GetInstallationName(ids[i]));
                        Log("   InstallationVersion: " + VSSetupConfig.GetInstallationVersion(ids[i]));
                        Log("      InstallationPath: " + VSSetupConfig.GetInstallationPath(ids[i]));
                        Log("           Description: " + VSSetupConfig.GetDescription(ids[i]));
                        Log("           DisplayName: " + VSSetupConfig.GetDisplayName(ids[i]));
                        Log("               Product: " + VSSetupConfig.GetProduct(ids[i]));
                        Log("           ProductPath: " + VSSetupConfig.GetProductPath(ids[i]));
                        Log("          IsLaunchable: " + VSSetupConfig.IsLaunchable(ids[i]));
                        Log("            IsComplete: " + VSSetupConfig.IsComplete(ids[i]));
                        Log("              Packages: " + VSSetupConfig.GetPackages(ids[i]));
                        Log("__________________________________");
                        
                        /* debug 2: iterate over packages
                        var v = JSON.parse(VSSetupConfig.GetPackages(ids[i]));
                        for(var l in  v)
                        {
                            Log(v[l].id);
                        }
                        */
                    }
                }
            }

            for(var k in data)
            {
                Log("  item: " + k);
                var r = data[k];
                if(r.key && r.type)
                {
                    var reg = Registry();
                    //Implementation of an alternative approach: reading VS data from user private registry file
                    //Private registry file is created with user specific configration at first VS launch
                    if(iter.privateregistry)
                    {
                        if(!iter.instances.length)
                            break;
                        var idx  = iter.instances.length - 1;
                        var file = iter.privateregistry.replace(/%id/g, iter.instances[idx].id);
                        Log("    registry file: " + file);
                        if(FileSystem.Exists(file))
                        {
                            var key_ = r.key.replace(/%id/g, iter.instances[idx].id);
                            
                            reg = reg.LoadAppKey(file,"read");
                            reg = reg.Key(key_);
                        }
                        else
                        {
                            Log("File not exists: " + file);
                            break;
                        }
                        Log("    key: " + key_ + "; value: " + r.value + "; type: " + r.type);
                    }
                    else
                    {
                        reg = Registry("HKLM", r.key);
                        Log("    key: " + r.key + "; value: " + r.value + "; type: " + r.type);
                    }
                    

                    var found;
                    found = false;

                    if(reg.Exists())
                    {
                        var val;
                        var subkeys;
                        var s_name;
                        var sub_reg;

                        if(r.value && r.type != "subkey_dir" && find(reg.Values(), r.value))
                        {
                            val = reg.Value(r.value);
                            Log("    value detected: " + val);

                            switch(r.type)
                            {
                            case "directory":
                                if(FileSystem.Exists(val))
                                {
                                    if(FileSystem.IsDirectory(val))
                                    {
                                        iter[k] = val;
                                        found = true;
                                    }
                                    else
                                        Log("    Target path is not directory");
                                }
                                else
                                    Log("    Directory doesn't exist");
                                break;
                            case "boolean":
                                iter[k] = true;
                                found = true;
                                break;
                            case "file":
                                if(FileSystem.Exists(val))
                                {
                                    if(!FileSystem.IsDirectory(val))
                                    {
                                        iter[k] = val;
                                        found = true;
                                    }
                                    else
                                        Log("    Target path is directory");
                                }
                                else
                                    Log("    File doesn't exist");
                                break;
                            case "value":
                                iter[k] = val;
                                found = true;
                                break;
                            }
                        }
                        else if(r.type == "subkey_dir")
                        {
                            subkeys = reg.Subkeys();
                            for(var sd in subkeys)
                            {
                                s_name = subkeys[sd];
                                Log("    look at subkey: " + s_name);
                                sub_reg = reg.Key(s_name);
                                if(find(sub_reg.Values(), r.value))
                                {
                                    val = sub_reg.Value(r.value);
                                    Log("      found value: " + val);

                                    if(FileSystem.Exists(val))
                                    {
                                        if(FileSystem.IsDirectory(val))
                                        {
                                            iter[k] = val;
                                            found = true;
                                            break;
                                        }
                                        else
                                            Log("      Target path is not directory");
                                    }
                                    else
                                        Log("      Directory doesn't exist");
                                }
                            }
                        }
                        else if(r.type == "subkey_value")
                        {
                            subkeys = reg.Subkeys();
                            for(var sv in subkeys)
                            {
                                s_name = subkeys[sv];
                                Log("    look at subkey: " + s_name);
                                sub_reg = reg.Key(s_name);
                                if(find(sub_reg.Values(), r.value))
                                {
                                    val = sub_reg.Value(r.value);
                                    Log("      found value: " + val);

                                    iter[k] = val;
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        Log("    registry key doesn't exist");

                        if(!found)
                        {
                            switch(r.type)
                            {
                            case "directory":
                            case "file":
                            case "value":
                            case "subkey_dir":
                                if(!iter.hasOwnProperty("instances")) // skip cleaning fields if registry not found for VS2017 and greater
                                    delete iter[k];
                                break;
                            case "boolean":
                                iter[k] = false;
                                break;
                            }
                        }
                    }
                }
            }
            
            //fill based on packages.
            if(iter.hasOwnProperty("instances"))
            {
                for(var t in data)
                {
                    if(typeof(data[t].pkgs) != "undefined")
                        iter[t] = iter.FilterInstances(data[t].pkgs);
                    if(data[t].fnc && typeof(data[t].fnc) == "function")
                        iter[t] = data[t].fnc();
                }
            }
        }
        add_common_info(studios);
    }

    fill(stud);

    this.CheckInstalledPackages = is_installed;
    this.GetVSInfo = function() {return stud;}
    this.Fill = fill;
}
