/*
 * MindTouch Deki - enterprise collaboration and integration platform
 * Copyright (C) 2006-2009 MindTouch, Inc.
 * www.mindtouch.com  oss@mindtouch.com
 *
 * For community documentation and downloads visit www.opengarden.org;
 * please review the licensing section.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 * http://www.gnu.org/copyleft/gpl.html
 */

if(typeof Deki.Api == 'undefined') {
	Deki.Api = {
		GetPage: function(id, callback) {
			Deki.$.get('/@api/deki/pages/' + id, null, function(xml) {
				var doc = Deki.$(xml);
				var page = {};
				page.title = doc.find('title').text();
				page.path = doc.find('path').text();
				page.ns = doc.find('namespace').text();
				// TODO: author
				page.description = doc.find('description').text();
				page.language = doc.find('language').text();
				// TODO: subpages, inbound, outbound, revisions, comments, properties, tags, files, contents
				
				if(typeof callback == 'string') {
					Deki.publish(callback, page);
				} else if(typeof callback == 'function') {
					callback(page);
				}
			}, 'xml');
		},
		
		EditTimeNow: function() {
			var d = new Date();
			var month = d.getUTCMonth() + 1;
			if(month < 10) month = "0" + month;
			var day = d.getUTCDate();
			if(day < 10) day = "0" + day;
			var hours = d.getUTCHours();
			if(hours < 10) hours = "0" + hours;
			var mins = d.getUTCMinutes();
			if(mins < 10) mins = "0" + mins;
			var secs = d.getUTCSeconds();
			if(secs < 10) secs = "0" + secs;
			return d.getUTCFullYear() + month + day + hours + mins + secs;
		},
		
		UpdatePage: function(path, contents, edittime, success, error) {
			if(!edittime) edittime = this.EditTimeNow();
			path = (!path || (path == "")) ? "home" : "=" + Deki.url.encode(Deki.url.encode(path));
			Deki.$.ajax({
				type: "POST",
				url: "/@api/deki/pages/" + path + "/contents?edittime=" + edittime,
				data: contents,
				contentType: "text/plain",
				success: success,
				error: error
			});
		},
		
		CreatePageFromTemplate: function(path, template, success, error) {
			// fetch template
			// lookup body[not(target)]
			// use as content on UpdatePage
		},
		
		Reload: function(dom, params) {
			var uri = Deki.Env.PageApi + '/contents?format=xhtml';
			if(params) {
				uri += '&' + Deki.$.param(params);
			}
			Deki.$(dom).load(uri + ' #' + dom.id);
		},
		
		PostText: function(uri, data, success) {
//			alert('PostText: ' + uri);
//			uri = uri.replace(/(\$\{[a-zA-Z0-9\.]+\})/, function(key) {
//				var value = Deki.Env[key];
//				return (typeof value != 'undefined') ? value : key;
//			});
//			alert(uri);
			Deki.$.ajax({ 
				type: 'POST', 
				url: uri, 
				data: data, 
				contentType: 'text/plain;', 
				success: success 
			});
		},
		
		Poll: function(interval, containerId, uri) {
	        Deki.$.get(uri, { containerId: containerId }, function(data){
                Deki.Api._callback(interval, containerId, uri, data);
            });
        },
        
        _callback :function (interval, id, uri, data) {
            if( data ) {
                Deki.$('#'+id).empty().append((new XMLSerializer()).serializeToString(data));
            }
            setTimeout(function() {
                Deki.Api.Poll(interval, id, uri);
            },interval);
        }
	};
}