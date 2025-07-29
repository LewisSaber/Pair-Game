import { useState } from "react";

type CustomGameProps = {
    onStart: (w:number,h:number)=> void
}

function CustomGame({ onStart }: CustomGameProps) {
    const [customWidth, setCustomWidth] = useState(4);
    const [customHeight, setCustomHeight] = useState(4);
    const [showCustom, setShowCustom] = useState(false);
  return (
      <>
          <button
              className="btn btn-outline-secondary w-50"
              onClick={() => setShowCustom(!showCustom)}
          >
              Custom
          </button>
          {showCustom && (
              <div className="border rounded mt-4 p-3 bg-light w-75 mx-auto">
                  <h5>Custom Game</h5>
                  <div className="row g-2 align-items-center justify-content-center">
                      <div className="col-auto">
                          <label className="form-label">Width:</label>
                          <input
                              type="number"
                              min="2"
                              max="10"
                              className="form-control"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(+e.target.value)}
                          />
                      </div>
                      <div className="col-auto">
                          <label className="form-label">Height:</label>
                          <input
                              type="number"
                              min="2"
                              max="10"
                              className="form-control"
                              value={customHeight}
                              onChange={(e) => setCustomHeight(+e.target.value)}
                          />
                      </div>
                      <div className="col-auto mt-4">
                          <button
                              className="btn btn-success"
                              onClick={() => onStart(customWidth, customHeight)}
                          >
                              Start                            </button>
                      </div>
                  </div>
              </div>
          )}
      </>
  );
}

export default CustomGame;