// import { Box, Button, Card, Container, Grid, Paper, Typography, useTheme } from "@mui/material";
// import { tokens } from "../styles/theme";
// import { useContext, useEffect, useRef, useState } from "react";
// import { DashboardContext, DashboardContextProvider } from "../data/DashboardContextProvider";
// import { ConnectionInfo, DataViewType, SchemaInfo } from "../api/model";
// import { DataView } from "./DataView";
// import { rgba } from "polished";
// import { useDrop } from "react-dnd";
// import { type } from "os";
// import Display from "../components/Display";
// import PoseView from "../components/PoseView";
// import LineChart from "../components/LineChart";
// import { useColors } from "../styles/styles";


// // TODO: React DnD
// type Coordinate = { r: number, c: number };
// type EditView = { r: number, c: number, w: number, h: number, type: DataViewType, temp: boolean };

// class EditGridModel {

//     static getCoordinate(i: number) {
//         return { r: Math.floor(i / 12), c: i % 12 };
//     }

//     static getIndex(r: number, c: number) {
//         return r * 12 + c;
//     }

//     drop(item: any, r: number, c: number): EditGridModel {
//         if (this.temp === undefined) return this;

//         const newModel = new EditGridModel();
//         newModel.views = [...this.views];

//         const w = Math.min(4, 12 - this.temp.c);
//         const proposedFillTargets = Array(w).fill(0).map((_, i) => {
//             return { r: this.temp!.r, c: this.temp!.c + i };
//         });

//         if (proposedFillTargets.some((target) => newModel.isFilled(target.r, target.c))) {
//             return newModel;
//         }

//         newModel.views.push({ ...this.temp, w: w });

//         console.log('Drop: ' + JSON.stringify(newModel.views));
//         return newModel;
//     }

//     isConsidered(r: number, c: number) {
//         if (this.temp === undefined) return false;
//         return this.temp.r === r && c - this.temp.c < 4 && c - this.temp.c >= 0
//     }

//     consider(item: any, r: number, c: number): EditGridModel {
//         const newModel = new EditGridModel();
        
//         newModel.views = this.views;
//         newModel.addView(item, r, c, true);

//         return newModel;
//     }

//     addView(item: any, r: number, c: number, isTemp?: boolean) {
//         const i = EditGridModel.getIndex(r, c);
//         var vi = Math.max(0, this.views.findIndex((v) => {
//             return i < EditGridModel.getIndex(v.r, v.c);
//         }));
//         // insert new view just before the view at vi
//         this.views.splice(vi, 0, { r: r, c: c, w: 4, h: 200, type: item.type, temp: isTemp ?? false });
//     }

//     isFilled(r: number, c: number): boolean {
//         return this.views.some((view) => {

//             return view.r === r && c - view.c < view.w && c - view.c >= 0;
//         });
//     }

//     getView(r: number, c: number): EditView | undefined {
//         const filtered = this.views.filter((v) => {
//             return v.r === r && v.c === c;
//         });
//         return filtered.length === 0 ? undefined : filtered[0];
//     }

//     views: EditView[];

//     getGrid() {
//         const out = [];
//         let j = 0;
//         for (const view of this.views) {
//             const i = this.getIndex(view.r, view.c);
//             while (j < i) {
//                 out.push(undefined);
//                 j++;
//             }
//             out.push({ r: this.getCoordinate(j).r, c: this.getCoordinate(j).c });
//             j += view.w;
//         }
//         while (j < 36) {
//             out.push(undefined);
//             j++;
//         }
//         return out;
//     }

//     constructor() {
//         this.views = [];
//         this.consider = this.consider.bind(this);
//         this.isConsidered = this.isConsidered.bind(this);
//         this.drop = this.drop.bind(this);
//         this.isFilled = this.isFilled.bind(this);
//         this.getView = this.getView.bind(this);
//         this.getGrid = this.getGrid.bind(this);
//     }
// }

// const DashboardEditor = ({ setDashboard }: { setDashboard: React.Dispatch<React.SetStateAction<any>> }) => {

//     const { dashboard } = useContext(DashboardContext);

//     const theme = useTheme();
//     const colors = tokens(useTheme().palette.mode);
//     const gridRef = useRef<HTMLDivElement | null>(null);

//     const [gridModel, setGridModel] = useState(new EditGridModel());


//     const normalizeWidth = (width?: number) => {
//         if (width === undefined) return gridRef.current?.clientWidth || 0;
//         console.log(gridRef.current?.clientWidth);
//         const norm = (width / (gridRef.current?.clientWidth || 0)) * 12;
//         return Math.max(1, Math.floor(norm + 0.5));
//     }


//     const handleResize = (index: number, w?: number, h?: number) => {

//         if (w === undefined && h === undefined) return;

//         const v = { ...dashboard!.dashboardViews[index] };

//         if (w !== undefined) { v.w = normalizeWidth(w); }
//         if (h !== undefined) { v.h = h; }

//         setDashboard({
//             ...dashboard,
//             dashboardViews: dashboard!.dashboardViews.map((view, i) => {
//                 if (i === index) {
//                     return v;
//                 }
//                 return view;
//             })
//         });
//     };

//     return (

//         <Grid p={8} spacing={0} ref={gridRef} container>
//             {
//                 gridModel.getGrid().map((o, index) => {
//                     const coord = gridModel.getCoordinate(index);
//                     return (
//                         o ?
//                             <Grid item xs={1} height={200} key={index}>
//                                 <DataViewGridItem type={'line'}></DataViewGridItem>
//                             </Grid>
//                             :
//                             <EditGridCell
//                                 gridModel={gridModel} setGridModel={setGridModel}
//                                 r={coord.r} c={coord.c} color={rgba(colors.primary[600], 0.25)} />
//                     )
//                 })
//             }
//         </Grid>
//     );
// }

// const DataViewGridItem = ({ type, animate }: { type: string, animate?: boolean }) => {
//     const colors = useColors();
//     const [isRendered, setIsRendered] = useState(!(animate ?? true));

//     useEffect(() => {
//         setIsRendered(true);
//     }, []);

//     return (
//         <Paper
//             sx={{
//                 backgroundColor: colors.primary[400],
//                 color: colors.grey[100],
//                 padding: 2,
//                 height: '100%',
//                 transform: isRendered ? 'scale(1)' : 'scale(0.75)',
//                 transition: 'transform 0.2s cubic-bezier(0.64, 0.57, 0.67, 1.53)',
//             }}
//         >
//             {type === 'line' && <LineChart connectionId={undefined} schemaId={undefined} args={[]} />}
//             {type === 'display' && <Display connectionId={undefined} schemaId={undefined} args={[]} />}
//             {type === 'pose' && <PoseView connectionId={undefined} schemaId={undefined} args={[]} />}
//         </Paper>
//     );
// }


// const EditGridCell = ({ color, r, c, gridModel, setGridModel }: {
//     color: string, r: number, c: number,
//     gridModel: EditGridModel, setGridModel: React.Dispatch<React.SetStateAction<EditGridModel>>
// }) => {
//     const [highlight, setHighlight] = useState(false);

//     const [{ canDrop, isOver }, drop] = useDrop(() => ({
//         accept: 'ADD_DATA_VIEW',
//         drop: (item: any) => {
//             setGridModel(
//                 (prev) => {
//                     return prev.drop(item, r, c);
//                 }
//             );
//         },
//         hover: (item: any) => {
//             setGridModel(
//                 (prev) => {
//                     return prev.consider(item, r, c);
//                 }
//             );
//         },
//         collect: (monitor) => ({
//             isOver: monitor.isOver(),
//             canDrop: monitor.canDrop(),
//         })
//     }));
//     //   console.log(others);

//     useEffect(() => {
//         setHighlight(gridModel.isConsidered(r, c));
//     }, [gridModel]);

//     return (
//         <Grid ref={drop} item xs={1} height={200}>
//             <Box
//                 sx={{
//                     backgroundColor: highlight ? rgba('white', 0.2) : color,
//                     border: rgba('white', 0.2),
//                     borderStyle: 'dashed',
//                     borderWidth: '1px',
//                     borderRadius: 0,
//                     height: 200,
//                     transition: 'background-color 0.1s ease-in-out', // Add transition property
//                 }}
//             >
//                 {/* TODO: Drag and drop targets - preview drop position and size */}
//             </Box>
//         </Grid>
//     );
// }

export {}
// export default DashboardEditor;

