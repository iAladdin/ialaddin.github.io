var daisy = daisy || {};
daisy.Sunburst = (data) => {
  const width = window.innerWidth,
    height = window.innerHeight,
    maxRadius = Math.min(width, height) / 2 - 5;

  const formatNumber = d3.format(',d');

  const x = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

  const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

  const color = d3.scaleOrdinal(d3.schemeCategory20);

  const partition = d3.partition();

  const arc = d3
    .arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

  const middleArcLine = d => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      angles.reverse();
    }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };

  const textFits = d => {
    const CHAR_SPACE = 5;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.name.length * CHAR_SPACE < perimeter;
  };

  const svg = d3
    .select('#chartContainer')
    .append('svg')
    .style('width', '100vw')
    .style('height', '90vh')
    .attr('id', 'chartSVG')
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on('click', () => focusOn()); // Reset zoom on canvas click

  const tooltipDiv = d3
    .select('#chartContainer')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'hidden tooltip');
  tooltipDiv
    .append('p')
    .append('span')
    .attr('id', 'value')
    .text('100%');

  d3.json('./baidu.json', (error, root) => {
    if (error) throw error;
    if (data != null) {
      root = JSON.parse(data);
    }
    root = d3.hierarchy(root);
    console.log(root);
    root.sum(d => d.size);

    const slice = svg.selectAll('g.slice').data(partition(root).descendants());

    slice.exit().remove();

    const newSlice = slice
      .enter()
      .append('g')
      .attr('class', 'slice')
      .on('click', d => {
        d3.event.stopPropagation();
        focusOn(d);
      });

    newSlice.append('title').text(d => d.data.name + '\n' + d.data.displaySize);

    newSlice
      .append('path')
      .attr('class', 'main-arc')
      .style('fill', d => color((d.children ? d : d.parent).data.name))
      .attr('d', arc)
      .on('mousemove', d => {
        d3.select('#tooltip')
          .style('left', d3.event.clientX + window.scrollX + 'px')
          .style('top', d3.event.clientY + window.scrollY + 'px')
          .select('#value')
          .html(() => {
            console.log(d);
            return (
              "<div style='background-color: #4a4; width:auto; height:auto; color: white; padding: 15px; text-align: middle; border: dotted 1px black;'><strong>" +
              d.data.name +
              '</strong> <br /> ' +
              d.data.displaySize +
              '</div>'
            );
          });
        d3.select('#tooltip').classed('hidden', false);
        // d3.select(d.path).style('fill', '#c00');
      })
      .on('mouseout', d => {
        console.log(d);
        d3.select('#tooltip').classed('hidden', true);
        // d3.select(d.path).style('fill', d.fill);
      });

    newSlice
      .append('path')
      .attr('class', 'hidden-arc')
      .attr('id', (_, i) => `hiddenArc${i}`)
      .attr('d', middleArcLine);

    const text = newSlice.append('text').attr('display', d => (textFits(d) ? null : 'none'));

    // Add white contour
    text
      .append('textPath')
      .attr('startOffset', '50%')
      .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
      .text(d => d.data.name + '\n' + d.data.displaySize)
      .style('fill', 'none')
      .style('stroke', '#fff')
      .style('stroke-width', 5)
      .style('stroke-linejoin', 'round');

    text
      .append('textPath')
      .attr('startOffset', '50%')
      .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
      .text(d => d.data.name + '\n' + d.data.displaySize);
  });

  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified

    const transition = svg
      .transition()
      .duration(750)
      .tween('scale', () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
        return t => {
          x.domain(xd(t));
          y.domain(yd(t));
        };
      });

    transition.selectAll('path.main-arc').attrTween('d', d => () => arc(d));

    transition.selectAll('path.hidden-arc').attrTween('d', d => () => middleArcLine(d));

    transition.selectAll('text').attrTween('display', d => () => (textFits(d) ? null : 'none'));

    moveStackToFront(d);

    function moveStackToFront(elD) {
      svg
        .selectAll('.slice')
        .filter(d => d === elD)
        .each(function (d) {
          this.parentNode.appendChild(this);
          if (d.parent) {
            moveStackToFront(d.parent);
          }
        });
    }
  }
  // Set-up the export button
  d3.select('#saveButton').on('click', function () {
    var svgString = getSVGString(svg.node());
    svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
      saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
    }
  });

  // Below are the functions that handle actual exporting:
  // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
  function getSVGString(svgNode) {
    svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    var serializer = new XMLSerializer();
    var svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
      var selectorTextArr = [];

      // Add Parent element Id and Classes to the list
      selectorTextArr.push('#' + parentElement.id);
      for (var c = 0; c < parentElement.classList.length; c++)
        if (!contains('.' + parentElement.classList[c], selectorTextArr))
          selectorTextArr.push('.' + parentElement.classList[c]);

      // Add Children element Ids and Classes to the list
      var nodes = parentElement.getElementsByTagName("*");
      for (var i = 0; i < nodes.length; i++) {
        var id = nodes[i].id;
        if (!contains('#' + id, selectorTextArr))
          selectorTextArr.push('#' + id);

        var classes = nodes[i].classList;
        for (var c = 0; c < classes.length; c++)
          if (!contains('.' + classes[c], selectorTextArr))
            selectorTextArr.push('.' + classes[c]);
      }

      // Extract CSS Rules
      var extractedCSSText = "";
      for (var i = 0; i < document.styleSheets.length; i++) {
        var s = document.styleSheets[i];

        try {
          if (!s.cssRules) continue;
        } catch (e) {
          if (e.name !== 'SecurityError') throw e; // for Firefox
          continue;
        }

        var cssRules = s.cssRules;
        for (var r = 0; r < cssRules.length; r++) {
          if (contains(cssRules[r].selectorText, selectorTextArr))
            extractedCSSText += cssRules[r].cssText;
        }
      }


      return extractedCSSText;

      function contains(str, arr) {
        return arr.indexOf(str) === -1 ? false : true;
      }

    }

    function appendCSS(cssText, element) {
      var styleElement = document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      styleElement.innerHTML = cssText;
      var refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore(styleElement, refNode);
    }
  }

  function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : 'png';

    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    var image = new Image();
    image.onload = function () {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(function (blob) {
        var filesize = Math.round(blob.length / 1024) + ' KB';
        if (callback) callback(blob, filesize);
      });


    };

    image.src = imgsrc;
  }
}