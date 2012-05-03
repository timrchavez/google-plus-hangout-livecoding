function initApp() {
  gapi.hangout.onApiReady.add(
    function(e) {
      if (e.isApiReady) {
        $('<div><select id="mode"></select><select id="theme"></select><textarea id="code"></textarea></div>').appendTo('body')
        var editor = CodeMirror.fromTextArea($('#code')[0], {
          lineNumbers: true,
          onKeyEvent : function (editor, e) {
            gapi.hangout.data.submitDelta({'editor_content': editor.getValue()})
          }
        })

        // Add modes
        $.each(CodeMirror.listModes(), function(i, v) {
          if ( i > 0 ) {
            $('select#mode').append('<option value="' + v + '">' + v + '</option>')
          }
        })

        $('select#mode')
          .change(function () {
            $("option:selected", this).each(function () {
              var mode = $(this).text()
              editor.setOption('mode', mode)
              gapi.hangout.data.submitDelta({'editor_mode': mode})
            })
          })
          .change()

        // Add themes
        var themes = ['default', 'ambiance', 'blackboard', 'cobalt',
                      'eclipse', 'elegant', 'lesser-dark', 'monokai',
                      'neat', 'night', 'rubyblue', 'xq-dark']

        $.each(themes, function(k,v) {
          $('select#theme').append('<option value="' + v + '">' + v + '</option>')
        })

        $('select#theme')
          .change(function () {
            $("option:selected", this).each(function () {
              editor.setOption('theme', $(this).text())
            })
          })
          .change()
      }

      gapi.hangout.data.onStateChanged.add(function(e) {
        var added = e.addedKeys,
            removed = e.removedKeys,
            metadata = e.metadata,
            state = e.state

        $('select#mode').val(state['editor_mode']).change()
        if ( editor.getValue() != added['editor_content'] ) {
          editor.setValue(added['editor_content'])
        }
      })
    }
  )
}

gadgets.util.registerOnLoadHandler(initApp);
