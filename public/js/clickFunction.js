$('.label-clickable label').click(function(){
    var href = $(this).find('input').attr('checked');
    if(href){
        window.location = href;
    }
});