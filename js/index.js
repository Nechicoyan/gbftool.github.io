var explusKkd = 88000;
var exKkd = 50567;
var hardKkd = 8000;
var normalKkd = 4000;

$(function () {

	$('input[name="target_kkd"').val(localStorage.getItem("target_kkd"));
    $('input[name="current_kkd"').val(localStorage.getItem("current_kkd"));

    console.log(localStorage.getItem("explus_kkd"));

    if (localStorage.getItem("explus_kkd")) {
        explusKkd = localStorage.getItem("explus_kkd");
    }

    if (localStorage.getItem("ex_kkd")) {
        exKkd = localStorage.getItem("ex_kkd");
    }

    $('input[name="explus_kkd"').val(getFormatInputDigit(String(explusKkd), 0));
    $('input[name="ex_kkd"').val(getFormatInputDigit(String(exKkd), 0));

    $('.format-digit').on('blur', function () {
        $(this).val(getFormatInputDigit($(this).val(), 0));
        refreshResult();
	});

    $('.format-digit').on('focus', function () {
        //���͒l�擾
        let val = $(this).val();
        //�J���}����
        let comma_removed_val = val.replaceAll(',', '');
        if (isNaN(comma_removed_val) || val.indexOf(',,') != -1) {
            //���l�łȂ���Ώ��������Ȃ�
            return;
        }
        $(this).val(comma_removed_val);
    });

	refreshResult();
});

function refreshResult() {

    var targetKkd = $('input[name="target_kkd"').val().replaceAll(',', '');
    var currentKkd = $('input[name="current_kkd"').val().replaceAll(',', '');
    explusKkd = String($('input[name="explus_kkd"').val()).replaceAll(',', '')
    exKkd = String($('input[name="ex_kkd"').val()).replaceAll(',', '')

	var restKkd = targetKkd - currentKkd;
	var tmpKkd = restKkd
	var modKkd;

    

	modKkd = tmpKkd % explusKkd;
	tmpKkd = tmpKkd - modKkd;

	localStorage.setItem("target_kkd", getFormatInputDigit(targetKkd, 0));
    localStorage.setItem("current_kkd", getFormatInputDigit(currentKkd, 0));
    localStorage.setItem("explus_kkd", getFormatInputDigit(String(explusKkd), 0));
    localStorage.setItem("ex_kkd", getFormatInputDigit(String(exKkd), 0));

    $("#rest").text(getFormatInputDigit(String(restKkd), 0));
    $("#explus").text(restKkd / explusKkd | 0);

    restKkd = restKkd % explusKkd;
    $("#ex").text(restKkd / exKkd | 0);

    restKkd = restKkd % exKkd;
    $("#hard").text(restKkd / hardKkd | 0);

    restKkd = restKkd % hardKkd;
    $("#normal").text(restKkd / normalKkd | 0);

    restKkd = restKkd % normalKkd;
    $("#rupi").text(restKkd);
}

/**
 * �t�H�[�}�b�g�ς݃e�L�X�g��Ԃ��֐�
 * @param {string} rawValue ���̃e�L�X�g
 * @param {number} fractionDigits �����_�ȉ��Œ茅��
 * @return {string} �t�H�[�}�b�g�ς݃e�L�X�gor�󔒕����i���l�ȊO�̏ꍇ�j
 */
function getFormatInputDigit(rawValue, fractionDigits) {
    if (rawValue === '') {
        //���[�U�[���󔒂ɂ����Ȃ�󔒂ɂ��ďI��
        return '';
    }
    //���͒l�𐔒l�������p�ϊ�
    let halfWidthVal = rawValue.replace(/[�O-�X]/g, function (x) {
        return String.fromCharCode(x.charCodeAt(0) - 0xFEE0);
    });
    //�J���}�������i���͒l�����l���ۂ����m�F�̂��߁j
    let commaRemovedVal = halfWidthVal.replaceAll(',', '').replaceAll('�A', '');
    if (isNaN(commaRemovedVal)) {
        //���l�łȂ���΋󔒂ɂ���
        return '';
    } else {
        //���͒l���J���}���萔���e�L�X�g�ɍĕϊ�
        return new Intl.NumberFormat('ja-JP', { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits }).format(commaRemovedVal);
    }
}