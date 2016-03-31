var socket = io.connect('http://localhost')
// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('incoming', { de: 'data'})
// })
//scroller
$(document).ready(function () {
  // $('td.isEmpty').children('a').attr('style', 'visibility:hidden;');
  // var parent = $.attr('note_block_scroller');
  // var child = $.attr('note_block');
  // var parent = document.getElementById('note_block_scroller');
  // var child = document.getElementById('note_block');
  // child.style.right = child.clientWidth - child.offsetWidth + "px";
  // var textAreaWidth = document.getElementById('note_block_scroller').scrollWidth;
  // document.getElementById('note_block').style.width = textAreaWidth + 'px';

  socket.emit('refresh', {});
  console.log('load_notes requested');

  socket.on('load_notes', function (data) {
    console.log('load_notes reveived');
    console.log(data);

    for(var i=0; i < data.length; i++) {

      var td = '#';
      var selected_td = td += data[i].round;
      // console.log(selected_td);
      $(selected_td).text('\u00A0'+data[i].notes.length+' notes\u00A0');
      if(data[i].notes.length < 1) {
        $(selected_td).addClass('isEmpty');
      } else {
        $(selected_td).addClass('hasNotes').css('visibility', 'visible');
        // $(selected_td).parent().addClass(hasNotesContainer);
      }
    }
  });

  $('#refresh').on('click', function () {
    socket.emit('refresh', {})
    console.log('refreshed');
  });

  $("#note_textfield").bind("enterKey", function() {
        var note = $('#note_textfield').val();
        var round = $('#current_round').text();
        socket.emit('write_note', {
          round: round,
          note: note
      });

      $('.note_block').prepend("<blockquote class='fw-300' style='letter-spacing:1px;'><p>" + $('#note_textfield').val() + "</p></blockquote>")

    $('#note_textfield').val('');

    var td = '#';
    var selected_td = td += round;
    console.log(selected_td);
  });

  $("#note_textfield").keyup(function (e) {
    if(e.keyCode == 13) {
      $(this).trigger("enterKey");
      socket.emit('refresh', {});
    };
  });

  $('a.hasNotes').on('click', function () {
    $('.note_block').html('');
    $('#current_round').text($(this).attr('id'));
    socket.emit('get_notes', { id: $(this).attr('id') });

  });

  $('a.isEmpty').parent().on('mouseover', function() {
    $(this).children('a').attr('style', 'visibility:visible;border:2px solid red;');
    $(this).children('a').attr('class', 'align-center table_round_add_note no-decoration slab-700').html('&nbsp; Add note &nbsp;');
    // $('#current_round').text($(this).attr('id'))
  });

  $('a.hasNotes').on('mouseover', function() {
    $(this).attr('style', 'visibility:visible;border:2px solid red;');
    console.log('a hasnotes found');
    // $(this).attr('class', 'align-center table_round_add_note no-decoration slab-700').html('&nbsp; Add note &nbsp;');
    // $('#current_round').text($(this).attr('id'))
  });

  $('a.isEmpty').on('mouseout', function() {
    $(this).attr('style', 'visibility:hidden;');
  });

  $('a.isEmpty').on('click', function() {
    $('#current_round').text($(this).attr('id'))
  });

  socket.on('render_notes', function (data) {
    for(var i=0;i < data.length;i++) {
      $('.note_block').prepend("<blockquote class='fw-300' style='letter-spacing:1px;'><p>" + data[i].note + "</p></blockquote>")
    }
  });
});
