(function (w, d) {
    let measurementObj = null; 
    //static vars
    const maxWidth = .80, // 80 percent should also match what is in css lightbox element
        divider = 1.5; //1.5 equals 1/3 and 2 equals 1/2
    //DOM elements
    const lightBox = d.getElementById('lightBox'),
      quoteElement = d.querySelector('article'),
      paragraphElement = d.querySelector('p'),
      signatureElement = d.querySelector('.signature'),
      rowDiv = d.querySelector('.row');

    const debounce = (callback, wait) => {
        let timeout = null
        return (...args) => {
          const next = () => callback(...args)
          clearTimeout(timeout)
          timeout = setTimeout(next, wait)
        }
    };

    const getMeasurements = () => {
      const spaceOutOfViewport = d.body.clientHeight - w.innerHeight
      return {
        lightBoxMaxWidth: d.body.clientWidth * maxWidth,
        scrollingValue: spaceOutOfViewport * divider
      }
    };

    const updateWidth = (event) => {
      const winScrollTop = w.scrollY;
      if (event === "resize") {
        measurementObj = getMeasurements(); // override measurement object only on resize as we need new dimensions
      }
      const {lightBoxMaxWidth, scrollingValue} = measurementObj;
      const updatedWidth = lightBoxMaxWidth * (1 - (winScrollTop / scrollingValue));
      lightBox.style.width = `${updatedWidth}px`;

    };

    function init() {
        measurementObj = getMeasurements();
        fetch('http://homework.warbyparker.com/').then((res)=> {
            return res.json();
        }).then((data)=> {
            quoteElement.innerHTML = data.quote;
            paragraphElement.innerHTML = data.author;
            signatureElement.innerHTML = data.publication;
            data.images.forEach((path)=> {
                const div = d.createElement('div');
                const img = d.createElement('img');
                img.setAttribute('src', path)
                div.appendChild(img);
                rowDiv.appendChild(div);
            })
        });
        //would normally add catch statement but didn't in this instance
        w.addEventListener('scroll', updateWidth);
        w.addEventListener('resize', debounce(() => {
            updateWidth('resize');   
        }, 250));
    }

    init();
        
}(window, document));
