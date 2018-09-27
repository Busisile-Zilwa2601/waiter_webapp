//check the box when the div is clicked and change color
$('.label-clickable').click(function(){
    var $this = $(this), $chk = $this.find('input:checkbox'), checked = $chk.is(':checked'); 
    $chk.prop('checked', !checked);
    $this.toggleClass('checked', !checked);
    if($chk.is(':checked')){
        $this.addClass("backgroundGrey");
    }else{
        $this.removeClass("backgroundGrey");
    }
});

