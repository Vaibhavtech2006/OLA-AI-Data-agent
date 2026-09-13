import React from 'react';
import './Cube.css';

const Cube = () => {
  return (
    <div className="scene">
      <div className="cube-core">
        
        {/* FRONT FACE */}
        <div className="cube-face front premium-glass">
          <div className="glass-reflection-top"></div>
          <div className="glass-reflection-left"></div>
          
          <div className="content-wrapper">
            <h3 className="section-title">CODE - PICK A PROBLEM</h3>
            <div className="problem-list">
              <div className="problem-item">
                <div className="problem-info">
                  <h4>Shelf Span of a Product Code</h4>
                  <span>Array</span>
                </div>
                <div className="badge badge-easy">Easy</div>
              </div>
              <div className="problem-item active-item">
                <div className="problem-info">
                  <h4>Largest Square Tile That Fits</h4>
                  <span>Array</span>
                </div>
                <div className="badge badge-solve">Solve &rarr;</div>
              </div>
              <div className="problem-item">
                <div className="problem-info">
                  <h4>Summit Sensor on a Mountain Trail</h4>
                  <span>Array</span>
                </div>
                <div className="badge badge-hard">Hard</div>
              </div>
              <div className="problem-item">
                <div className="problem-info">
                  <h4>Merged Leaderboard Midpoint</h4>
                  <span>Array</span>
                </div>
                <div className="badge badge-medium">Medium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Baaki faces (Tu inme bhi apna content daal sakta hai baad mein) */}
        <div className="cube-face back premium-glass">
          <div className="content-wrapper">
             <h3 className="section-title text-center mt-10">BACK FACE</h3>
          </div>
        </div>
        <div className="cube-face right premium-glass">
           <div className="content-wrapper">
             <h3 className="section-title text-center mt-10">RIGHT FACE</h3>
          </div>
        </div>
        <div className="cube-face left premium-glass">
           <div className="content-wrapper">
             <h3 className="section-title text-center mt-10">LEFT FACE</h3>
          </div>
        </div>
        <div className="cube-face top premium-glass"></div>
        <div className="cube-face bottom premium-glass"></div>
        
      </div>
    </div>
  );
};

export default Cube;