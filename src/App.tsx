// App.jsx / App.tsx
import { useRef, useState } from 'react';
import ParagraphEditor from './ParagraphEditor/ParagraphEditor';
import { EnablePremiumFeatures } from './constants';
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css"
import { CKEditorContext } from '@ckeditor/ckeditor5-react';
import { Context, ContextWatchdog } from 'ckeditor5';

const content1 = "<p>1. After construction ends, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span> <span class='bracket-option' data-id='option-3' data-opted-state='UNDECIDED' data-editable='true'>insert term</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>14,000 cu. ft.</span><span class='metric'>4 300 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>60 deg F</span><span class='metric'>16 deg C</span></span> and a relative humidity no higher than 60 percent.</p>";
const content2 = "<p>2. During construction, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='UNDECIDED'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>10,000 cu. ft.</span><span class='metric'>3 000 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>65 deg F</span><span class='metric'>18 deg C</span></span> and a relative humidity no higher than 50 percent.</p>";
const content3 = "<p>3. After occupancy, prior to occupancy and with all interior finishes <span class='bracket-option' data-id='option-1' data-opted-state='OPTED_IN'>installed</span> <span class='bracket-option' data-id='option-2' data-opted-state='OPTED_OUT'>set up</span>, perform a building flush-out by supplying a total volume of <span class='units-of-measure'><span class='imperial'>12,000 cu. ft.</span><span class='metric'>3 600 000 L</span></span> of outdoor air per <span class='units-of-measure'><span class='imperial'>sq. ft.</span><span class='metric'>sq. m</span></span> of floor area while maintaining an internal temperature of at least <span class='units-of-measure'><span class='imperial'>70 deg F</span><span class='metric'>21 deg C</span></span> and a relative humidity no higher than 55 percent.</p>";
const content4 = `
    <table>
        <thead>
            <tr>
                <th>Door Name</th>
                <th>Material</th>
                <th>Color</th>
                <th>Size</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Manufacturer</th>
                <th>Weight</th>
                <th>Fire Rating</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Wood Door</td>
                <td>Wood</td>
                <td>Brown</td>
                <td><span class='units-of-measure'><span class='imperial'>36" x 80"</span><span class='metric'>91 cm x 203 cm</span></span></td>
                <td>$299.99</td>
                <td>In Stock</td>
                <td>Acme Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>50 lbs</span><span class='metric'>22.7 kg</span></span></td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>Steel Door</td>
                <td>Steel</td>
                <td>White</td>
                <td><span class='units-of-measure'><span class='imperial'>32" x 80"</span><span class='metric'>81 cm x 203 cm</span></span></td>
                <td>$199.99</td>
                <td>In Stock</td>
                <td>Superior Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>40 lbs</span><span class='metric'>18.1 kg</span></span></td>
                <td>12 hours</td>
            </tr>
            <tr>
                <td>Composite Door</td>
                <td>Composite</td>
                <td>Gray</td>
                <td><span class='units-of-measure'><span class='imperial'>30" x 80"</span><span class='metric'>76 cm x 203 cm</span></span></td>
                <td>$149.99</td>
                <td>Out of Stock</td>
                <td>Elite Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>35 lbs</span><span class='metric'>15.9 kg</span></span></td>
                <td>1 Hour</td>
            </tr>
            <tr>
                <td>Fiberglass Door</td>
                <td>Fiberglass</td>
                <td>White</td>
                <td><span class='units-of-measure'><span class='imperial'>28" x 80"</span><span class='metric'>71 cm x 203 cm</span></span></td>
                <td>$99.99</td>
                <td>In Stock</td>
                <td>Premium Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>30 lbs</span><span class='metric'>13.6 kg</span></span></td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>Wood Closet Door</td>
                <td>Wood</td>
                <td>White</td>
                <td><span class='units-of-measure'><span class='imperial'>24" x 80"</span><span class='metric'>61 cm x 203 cm</span></span></td>
                <td>$79.99</td>
                <td>In Stock</td>
                <td>Deluxe Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>25 lbs</span><span class='metric'>11.3 kg</span></span></td>
                <td>N/A</td>
            </tr>
            <tr>
                <td>Steel Garage Door</td>
                <td>Steel</td>
                <td>Gray</td>
                <td><span class='units-of-measure'><span class='imperial'>96" x 84"</span><span class='metric'>244 cm x 213 cm</span></span></td>
                <td>$599.99</td>
                <td>In Stock</td>
                <td>Master Doors</td>
                <td><span class='units-of-measure'><span class='imperial'>100 lbs</span><span class='metric'>45.4 kg</span></span></td>
                <td>12 Hours</td>
            </tr>
        </tbody>
    </table>`;
const content5 = "<p>5. Stainless Steel Pans for Acoustical Metal Pan Ceiling <span class='bracket-option' data-id='option-1' data-opted-state='UNDECIDED' data-editable='true'>Insert drawing designation</span>: Product type detail here.</p>";
const content6 = `<p>6. Door height: <span class="bracket-option" data-id="option-1" data-opted-state="UNDECIDED">
    Between <span class='nested-units-of-measure'><span class='imperial'>48" x 160"</span><span class='metric'>122 cm x 406 cm</span></span> 
    and <span class='nested-units-of-measure'><span class='imperial'>72" x 160"</span><span class='metric'>183 cm x 406 cm</span></span></span> 
    <span class="bracket-option" data-id="option-2" data-opted-state="UNDECIDED">
    Between <span class='nested-units-of-measure'><span class='imperial'>96" x 84"</span><span class='metric'>244 cm x 213 cm</span></span> 
    and <span class='nested-units-of-measure'><span class='imperial'>120" x 84"</span><span class='metric'>305 cm x 213 cm</span></span></span>.</p>`;
const content7 = "<p><span class='paragraph-text' data-id='123'>Hello world!</span></p>";

const App: React.FC = () => {
    const presenceListElementRef = useRef<HTMLDivElement>(null);
    const sidebarElementRef = useRef<HTMLDivElement>(null);

    return (
        <div>
            <h2>Using CKEditor&nbsp;5 in React</h2>
            <p>Click a paragraph to edit it.</p>
            <div>
                <div ref={presenceListElementRef}></div>
            </div>
            <div className="outer-container">
                <CKEditorContext
                    context={Context}
                    contextWatchdog={ContextWatchdog}
                    config={
                        {
                            sidebar: {
                                container: sidebarElementRef.current!
                            },
                        }
                    }
                >
                    <div className="editor-container">
                        <div className="editor-instance">
                            <ParagraphEditor initialData={content7} />
                        </div>
                    </div>
                </CKEditorContext>
                <div className="sidebar">
                    <div ref={sidebarElementRef} ></div>
                </div>

            </div>
        </div>
    );
}

export default App;