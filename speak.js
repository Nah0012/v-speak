window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
var Recorder = {
    recognition : null,
    init: function(){
        var o = this;
        o.recognition = new SpeechRecognition();
        o.recognition.lang = 'ja';
        o.recognition.continuous = true;
    },
    recStart: function(){
        var o = this;
        o.recognition.start();
    },
    recStop: function(){
        var o = this;
        o.recognition.stop();
    },
    getRecText: function(results, resultIndex){
        var text;
        for(var i = resultIndex; i < results.length; i++){
            var result = results.item(i);
            if(result.final === true || result.isFinal === true){
                text = result.item(0).transcript;
            }
        }
        return text;
    }
}
var Speeker = {
    synthes: null,
    init: function(){
        var o = this;
        o.synthes = new SpeechSynthesisUtterance();
        o.synthes.lang = "ja-JP"
    },
    say: function(msgText){
        var o = this;
        o.synthes.text = msgText;
        speechSynthesis.speak(o.synthes);
    }
}
var View = {
    getResultItem: function(text){
        var el = document.createElement('li');
        el.textContent = text;
        return el;
    }
}
var App = {
    el: {
        recBtn: $DEMO[0].querySelector('.recPlayer__recBtn'),
        resultList: $DEMO[0].querySelector('.recPlayer__results ul')
    },
    status: {
        nowRec: false,
        recorderText: ''
    },
    init: function(){
        var o = this;
        Recorder.init();
        Speeker.init();
        Recorder.recognition.addEventListener('start', function(){
            o.status.nowRec = true;
            o.el.recBtn.textContent = '停止';
        });
        Recorder.recognition.addEventListener('end', function(){
            o.status.nowRec = false;
            o.el.recBtn.textContent = '録音';
        });
        Recorder.recognition.addEventListener('result', function(event){
            var text = Recorder.getRecText(event.results, event.resultIndex);
            o.el.resultList.insertBefore(
                View.getResultItem(text),
                o.el.resultList.firstChild
            );
            Speeker.say(text);
        });
        o.el.recBtn.addEventListener('click', function(){
            if(o.status.nowRec){
                Recorder.recStop();
            }
            else{
                Recorder.recStart();
            }
        });
    }
}
App.init();