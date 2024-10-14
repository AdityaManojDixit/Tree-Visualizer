"use client";

import * as d3 from "d3";
import TreePlot from "@/components/ui/custom/TreePLot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import createBSTHierarchy from "../lib/nodeParser"

import { ScrollArea } from "@/components/ui/scroll-area"




export default function Home() {
  const [nodeData, setNodeData] = useState<number | null>(null);
  const [nodes, setNodes] = useState<number[]>([]);
  const [hierarchy, setHierarchy] = useState<{name : any, children : any[]} | null>(null);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = Number(e.target.value)
    setNodeData(data);
  };
  const handleButtonClick = () => {
    if(nodeData !== null && !nodes.includes(nodeData) && nodeData!==0){
      setNodes((prevNodes) => [...prevNodes, nodeData]);
      setHierarchy(createBSTHierarchy(nodes));
    }
  
    console.log("Submitted value:", nodeData);
    setNodeData(null); 
  };


  return (

    <div className="flex flex-row">

      <div className="rounded-md border-2 w-1/3 m-10 mt-20 p-10 space-y-2">
        <>
          <Label htmlFor="value">Node Data:</Label>
          <Input 
            type="number"
            value={nodeData ?? ''}
            onChange={handleInputChange}  placeholder="Enter a value" />
          <Button onClick={handleButtonClick} type="submit">Submit</Button>
        </>

        <>
          <Table className="w-full text-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Node</TableHead>
                <TableHead className="w-[100px]">Data</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 overflow-auto ">
            <Table >
                <TableBody>
                  {
                      nodes.length > 0 ? (
                      nodes.map((value, index) => (
                        <TableRow key={index}>
                          <TableCell className="w-[100px] text-md">{index + 1}</TableCell>
                          <TableCell className="w-[100px] text-md">{value}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No nodes inserted</TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
            </Table>
          </ScrollArea>
        </>

      </div>

      {/* Display Section */}
      <div className="rounded-md border-2 w-2/3 m-10 mt-20 p-10 "  >
          <TreePlot data = {hierarchy} />
      </div>
    
    </div>
  );
}
