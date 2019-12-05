//Стртовая страница со списком чатов
$(document).on('page:init', '.page[data-page="chats"]', function (e) {

    alert("Я на странице чатов")

    try {
        store.set("curChatUserId", (store.get("profile").name || '').split(' ').join('') + (store.get("profile").dt_birth || '').split('-').join(''))
    } catch(e) {
        alert(e)
    }

    alert("g1: " + (store.get('isG1') || false))

    store.set('current_page_name', 'chats')
    var res_chats_list = ''
    res_chats_list = res_chats_list + ('<ul>')
    res_chats_list = res_chats_list + ('<li class="item-content">')
    res_chats_list = res_chats_list + ('  <div class="item-inner">')
    res_chats_list = res_chats_list + ('      <div>Чатов еще нет. Возможно они еще не загрузились. Вы можете <a style="color:#f4590b;" href="/chat-add/">создать новый</a>.</div>')
    res_chats_list = res_chats_list + ('  </div></li>')
    res_chats_list = res_chats_list + ('</ul>')
    $('body').find('.chats-list').html(res_chats_list)
    $('body').find('.chats-list').css('display', '')

    //Запрос и размметка списка чатов
    console.log("====== : loadchatslist")
    loadchatslist()




    alert("777")

})

//Запрос данных и формирование разметки страницы списка чатов
function loadchatslist() {
    var urlParams = store.get('API_ENDPOINT')
    var rqUrl = urlParams.chat1c.http + urlParams.chat1c.service + urlParams.chat1c.getChats
    var rqHeadParams = {
        "Authorization": "Basic " + btoa(LZString.decompress(store.get('_')))
    }

    app.preloader.show()
    console.log("=== 3157 === REQUEST: ", rqUrl)
    app.request({
        url: rqUrl,
        type: 'GET',
        headers: rqHeadParams,
        error: function (r) {
            app.preloader.hide()
            app.dialog.alert('Не удалось загрузить список чатов! Пожалуйста, попробуйте позднее!', 'Ошибка')
        },
        success: function (r) {
            if (r.charCodeAt(0) === 0xFEFF) {
                r = r.substr(1);
            }

            $('body').find('.chats-list').css('display', '')
            $('body').find('.chats-list').html('&nbsp;&nbsp;Загрузка...')

            try {
                var r = JSON.parse(r)
            }
            catch {
                var r = []
            }
            console.log("=== 3157 === SUCCES: ", r)

            try {
                var images = []
                var total_unread = 0
                var records = r

                //console.log("===== records: ", records)

                var res_chats_list = '<ul>'
                for (var cv = 0; cv < records.length; cv++) {
                    var last_m = '<div class="item-text">Сообщений нет</div>'
                    if (records[cv].last_m != false) {
                        last_m = '<div class="item-subtitle">' + records[cv].last_m.user_name + ':</div>'
                        last_m = last_m + '<div class="item-text" style="    text-overflow: ellipsis;">' + records[cv].last_m.m_val + '</div>'
                    }
                    var unread = ''
                    if (records[cv].unreadead > 0) {
                        total_unread = parseInt(total_unread) + parseInt(records[cv].unreadead)
                        if (records[cv].unreadead > 9)
                            unread = '<span class="badge color-red" style="margin-left:24px;">9+</span>'
                        else
                            unread = '<span class="badge color-red" style="margin-left:28px;">' + records[cv].unreadead + '</span>'
                    }

                    if (records[cv].chat_photo.indexOf('87.245.138.69/') > (-1)) {
                        records[cv].chat_photo = records[cv].chat_photo.replace('87.245.138.69/', '87.245.138.69:81/')
                    }
                    if (records[cv].chat_photo == '')
                        records[cv].chat_photo = 'https://images.weserv.nl/?url=cdn0.iconfinder.com/data/icons/superuser-web-kit-thin/512/686943-users_people_men_humans_heads_persons-512.png&output=jpg&mask=circle'
                    var br = "url('" + records[cv].chat_photo + "')"
                    images.push({ uid: records[cv].chat_id, chat_photo: records[cv].chat_photo })
                    res_chats_list = res_chats_list + '<li>'
                    res_chats_list = res_chats_list + '<a href="/chat/' + records[cv].chat_id + '/" class="item-link item-content">'
                    res_chats_list = res_chats_list + '<div class="item-media">'
                    res_chats_list = res_chats_list + '<div class="chat-image" uid="' + records[cv].chat_id + '" style="border-radius:50%;width:40px;height:40px;background:' + br + ';border-radius: 50%;'
                    res_chats_list = res_chats_list + '    box-shadow: 0 0 10px rgba(0,0,0,0.5);background-size:cover;background-repeat:no-repeat;'
                    res_chats_list = res_chats_list + '    padding: 0px;'
                    res_chats_list = res_chats_list + '    width: 40px;'
                    res_chats_list = res_chats_list + '    height: 40px;" >        '
                    res_chats_list = res_chats_list + unread
                    res_chats_list = res_chats_list + '</div>'
                    res_chats_list = res_chats_list + '</div> '
                    res_chats_list = res_chats_list + '<div class="item-inner">'
                    res_chats_list = res_chats_list + '<div class="item-title-row">'
                    res_chats_list = res_chats_list + '<div class="item-title">' + records[cv].chat_name + '</div>'
                    res_chats_list = res_chats_list + '<div class="item-after">' + records[cv].ltDt + '</div>'
                    res_chats_list = res_chats_list + '</div>'
                    res_chats_list = res_chats_list + last_m
                    res_chats_list = res_chats_list + '</div>'
                    res_chats_list = res_chats_list + '</a>'
                    res_chats_list = res_chats_list + '</li>'
                } //for(var cv = 0; cv < records.length; cv ++) 

                res_chats_list = res_chats_list + ('</ul>')
                $('body').find('.chats-list').html(res_chats_list)

                if (total_unread > 0) {
                    if (total_unread > 9) {
                        $('body').find('#new-chats-updates-id').html('<span class="badge color-red" style="">9+</span>')
                        $('body').find('.new-chats-updates-class').html('<span class="badge color-red" style="">9+</span>')
                        try {
                            cordova.plugins.notification.badge.set(total_unread)
                        } catch (e) { }
                    } else {
                        $('body').find('#new-chats-updates-id').html('<span class="badge color-red" style="">' + total_unread + '</span>')
                        $('body').find('.new-chats-updates-class').html('<span class="badge color-red" style="">' + total_unread + '</span>')
                        try {
                            cordova.plugins.notification.badge.set(total_unread)
                        } catch (e) { }
                    }

                } else {
                    $('body').find('#new-chats-updates-id').html('')
                    $('body').find('.new-chats-updates-class').html('')
                    try {
                        cordova.plugins.notification.badge.clear();
                    } catch (e) { }
                }
                store.set('total_unread_chats', total_unread)
            } catch (e) {
                app.preloader.hide()
                var toastBottom = app.toast.create({
                    text: '#3.350 Не удалось загрузить список чатов',
                })
                toastBottom.open()
                setTimeout(function () {
                    toastBottom.close();
                }, 1000)
            }
            if (records.length < 1) {
                var res_chats_list = ''
                res_chats_list = res_chats_list + ('<ul>')
                res_chats_list = res_chats_list + ('<li class="item-content">')
                res_chats_list = res_chats_list + ('  <div class="item-inner">')
                res_chats_list = res_chats_list + ('      <div>Чатов еще нет. Вы можете <a style="color:#f4590b;" href="/chat-add/">создать новый</a>.</div>')
                res_chats_list = res_chats_list + ('  </div></li>')
                res_chats_list = res_chats_list + ('</ul>')
                $('body').find('.chats-list').html(res_chats_list)
            } //if(res_chats.length < 1) 
            var searchbar = app.searchbar.create({
                el: '.searchbar1',
                searchContainer: '.chats-list',
                searchIn: '.item-inner',
                on: {
                    search(sb, query, previousQuery) {
                        console.log(query, previousQuery)
                    }
                }
            })
            app.preloader.hide()
        }
    })

    //крутим цикл проверки не прочитанных сообщений
    setInterval(function () {
        var total_unread = parseInt(store.get('total_unread_chats'))
        if (total_unread > 0) {
            if (total_unread > 9) {
                $('body').find('#new-chats-updates-id').html('<span class="badge color-red" style="">9+</span>')
                $('body').find('.new-chats-updates-class').html('<span class="badge color-red" style="">9+</span>')
                try {
                    cordova.plugins.notification.badge.set(total_unread)
                } catch (e) { }
            } else {
                $('body').find('#new-chats-updates-id').html('<span class="badge color-red" style="">' + total_unread + '</span>')
                $('body').find('.new-chats-updates-class').html('<span class="badge color-red" style="">' + total_unread + '</span>')
                try {
                    cordova.plugins.notification.badge.set(total_unread)
                } catch (e) { }
            }
        } else {
            $('body').find('#new-chats-updates-id').html('')
            $('body').find('.new-chats-updates-class').html('')
            try {
                cordova.plugins.notification.badge.clear()
            } catch (e) { }
        }
    }, 1000)
} //function loadchatslist() {

function toastMessage(text = "error message: ", pos = "bottom", timeOut = 5000) {
    var position = (pos == "top" || pos == "center" || pos == "bottom") ? pos : "bottom"
    var toast = app.toast.create({
        text: text,
        position: position,
        closeTimeout: timeOut,
    })
    toast.open()

    setTimeout(function () {
        toast.destroy()
    }, timeOut + 1)
}

function UrlExists(url) {
    try {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404)
            return true
        else
            return false
    } catch (e) {
        return false
    }
}

function urlifyChats(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        var url1 = url
        var qrts = "'"
        if (url1.length > 35)
            url1 = url1.slice(0, 15) + '...' + url1.slice(url1.length - 15)
        return '<a  onclick="cordova.InAppBrowser.open(' + qrts + url + qrts + ', ' + qrts + '_system' + qrts + ', ' + qrts + 'location=yes' + qrts + ');"  class="external "  href="' + url + '">' + url1 + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

function urlifyChatsMy(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        var url1 = url
        var qrts = "'"
        if (url1.length > 35)
            url1 = url1.slice(0, 15) + '...' + url1.slice(url1.length - 15)
        return '<a  onclick="cordova.InAppBrowser.open(' + qrts + url + qrts + ', ' + qrts + '_system' + qrts + ', ' + qrts + 'location=yes' + qrts + ');"  class="external external1" style="color:white !important;" href="' + url + '">' + url1 + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
