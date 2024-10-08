var defaultExplusKkd = 127600;
var defaultExKkd = 64800;

var explusKkd = 127600;
var exKkd = 64800;
var veryhardKkd = 21400;
var hardKkd = 8000;
var normalKkd = 4000;

$(function () {

	$('input[name="target_kkd"]').val(localStorage.getItem("target_kkd"));
    $('input[name="current_kkd"]').val(localStorage.getItem("current_kkd"));

    console.log(localStorage.getItem("explus_kkd"));

    if (localStorage.getItem("explus_kkd")) {
        explusKkd = localStorage.getItem("explus_kkd");
    }

    if (localStorage.getItem("ex_kkd")) {
        exKkd = localStorage.getItem("ex_kkd");
    }

    $('#ex_toggle').attr('checked', true).prop('checked', (localStorage.getItem("enable_ex") == 'true')).change();
    $('#very_hard_toggle').attr('checked', true).prop('checked', (localStorage.getItem("enable_very_hard") == 'true')).change();
    $('input[name="explus_kkd"]').val(getFormatInputDigit(String(explusKkd), 0));
    $('input[name="ex_kkd"]').val(getFormatInputDigit(String(exKkd), 0));

    $('#reset_button_explus').click(function() {
        $('input[name="explus_kkd"]').val(getFormatInputDigit(String(defaultExplusKkd), 0));
        refreshResult();
    });

    $('#reset_button_ex').click(function() {
        $('input[name="ex_kkd"]').val(getFormatInputDigit(String(defaultExKkd), 0));
        refreshResult();
      });

    $('.format-digit').on('blur', function () {
        $(this).val(getFormatInputDigit($(this).val(), 0));
        refreshResult();
	});

    $('.format-digit').on('focus', function () {
        //入力値取得
        let val = $(this).val();
        //カンマ除去
        let comma_removed_val = val.replaceAll(',', '');
        if (isNaN(comma_removed_val) || val.indexOf(',,') != -1) {
            //数値でなければ処理をしない
            return;
        }
        $(this).val(comma_removed_val);
    });

    $('input[type="checkbox"]').change(function () {
        refreshResult();
    });

	refreshResult();
});

function refreshResult() {
    console.log('refreshResult');
    var targetKkd = $('input[name="target_kkd"]').val().replaceAll(',', '');
    var currentKkd = $('input[name="current_kkd"]').val().replaceAll(',', '');
    var enableEx = $('#ex_toggle').prop("checked");
    var enableVeryHard = $('#very_hard_toggle').prop("checked");

    explusKkd = String($('input[name="explus_kkd"]').val()).replaceAll(',', '');
    exKkd = String($('input[name="ex_kkd"]').val()).replaceAll(',', '');

	var restKkd = targetKkd - currentKkd;
    var tmpKkd = restKkd;
	var modKkd;

    

	modKkd = tmpKkd % explusKkd;
	tmpKkd = tmpKkd - modKkd;

	localStorage.setItem("target_kkd", getFormatInputDigit(targetKkd, 0));
    localStorage.setItem("current_kkd", getFormatInputDigit(currentKkd, 0));
    localStorage.setItem("explus_kkd", getFormatInputDigit(String(explusKkd), 0));
    localStorage.setItem("ex_kkd", getFormatInputDigit(String(exKkd), 0));
    localStorage.setItem("enable_ex", String(enableEx));
    localStorage.setItem("enable_very_hard", String(enableVeryHard));

    $("#rest").text(getFormatInputDigit(String(restKkd), 0));

    $("#explus").text(restKkd / explusKkd | 0);
    restKkd = restKkd % explusKkd;

    if (enableEx) {    
        $("#ex").text(restKkd / exKkd | 0);
        restKkd = restKkd % exKkd;
    } else {
        $("#ex").text(0);
    }

    if (enableVeryHard) {
        $("#very_hard").text(restKkd / veryhardKkd | 0);
        restKkd = restKkd % veryhardKkd;
    } else {
        $("#very_hard").text(0);
    }

    $("#hard").text(restKkd / hardKkd | 0);
    restKkd = restKkd % hardKkd;

    $("#normal").text(restKkd / normalKkd | 0);
    restKkd = restKkd % normalKkd;

    $("#rupi").text(restKkd);
}

/**
 * フォーマット済みテキストを返す関数
 * @param {string} rawValue 元のテキスト
 * @param {number} fractionDigits 小数点以下固定桁数
 * @return {string} フォーマット済みテキストor空白文字（数値以外の場合）
 */
function getFormatInputDigit(rawValue, fractionDigits) {
    if (rawValue === '') {
        //ユーザーが空白にしたなら空白にして終了
        return '';
    }
    //入力値を数値だけ半角変換
    let halfWidthVal = rawValue.replace(/[０-９]/g, function (x) {
        return String.fromCharCode(x.charCodeAt(0) - 0xFEE0);
    });
    //カンマを除去（入力値が数値か否かを確認のため）
    let commaRemovedVal = halfWidthVal.replaceAll(',', '').replaceAll('、', '');
    if (isNaN(commaRemovedVal)) {
        //数値でなければ空白にする
        return '';
    } else {
        //入力値をカンマ入り数字テキストに再変換
        return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(commaRemovedVal);
    }
}