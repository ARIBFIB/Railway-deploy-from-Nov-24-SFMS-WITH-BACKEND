// Voucher List Configuration
// Opens the voucher list filter in a new window/tab

export const openVoucherList = () => {
  // Import the component dynamically
  import('./VoucherList')
    .then(module => {
      const VoucherList = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=760,height=450,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Voucher List</title>
            <style>
              body {
                margin: 0;
                padding: 12px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #000000;
                background-color: #FFFFFF;
                line-height: 14px;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script>
              // Dynamically load React and ReactDOM
              const reactScript = document.createElement('script');
              reactScript.src = 'https://unpkg.com/react@18/umd/react.development.js';
              reactScript.integrity = 'sha384-TXfW0IlEIytMU1/7GykwXBbm/3FcU1oJXuBXwNDhGSXDxnU3eEB7E/sfT6fJVb9c';
              reactScript.crossOrigin = 'anonymous';
              
              const reactDOMScript = document.createElement('script');
              reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
              reactDOMScript.integrity = 'sha384-9QHjYqkp36iMCxD8E6WVDdYEm0S8aH1DDPvEVqhmO4hEFygpQkzEOcDFfyXz1Z2';
              reactDOMScript.crossOrigin = 'anonymous';
              
              const babelScript = document.createElement('script');
              babelScript.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
              
              reactScript.onload = function() {
                document.head.appendChild(reactDOMScript);
              };
              
              reactDOMScript.onload = function() {
                document.head.appendChild(babelScript);
              };
              
              babelScript.onload = function() {
                // Render the component after Babel loads
                setTimeout(() => {
                  const rootElement = document.getElementById('root');
                  if (rootElement && window.React && window.ReactDOM) {
                    window.ReactDOM.render(window.React.createElement(VoucherList), rootElement);
                  }
                }, 500);
              };
              
              document.head.appendChild(reactScript);
            </script>
          </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.focus();
      }
    })
    .catch(error => {
      console.error('Error loading VoucherList component:', error);
      // Fallback: open a simple error message
      const errorWindow = window.open('', '_blank', 'width=400,height=200');
      if (errorWindow) {
        errorWindow.document.write(`
          <html>
            <head><title>Error</title></head>
            <body>
              <h3>Error loading Voucher List</h3>
              <p>Please try again later.</p>
            </body>
          </html>
        `);
        errorWindow.document.close();
      }
    });
};