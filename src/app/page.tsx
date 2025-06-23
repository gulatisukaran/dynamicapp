'use client'

import { useState } from "react";

export default function Home() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const flatJsonUI = [
        {
          "type": "input",
          "props": {
            "type": "text",
            "name": "food",
            "placeholder": "Food Item (e.g. Banana)",
            "className": "border p-2 w-full mb-2"
          }
        },
        {
          "type": "input",
          "props": {
            "type": "number",
            "name": "calories",
            "placeholder": "Calories",
            "className": "border p-2 w-full mb-2"
          }
        },
        {
          "type": "textarea",
          "props": {
            "name": "notes",
            "placeholder": "Any notes (optional)",
            "className": "border p-2 w-full mb-4"
          }
        },
        {
          "type": "button",
          "props": {
            "text": "Add Entry",
            "className": "bg-blue-600 text-white p-2 rounded"
          }
        }
    ];

    const [myJsonArray, setMyJsonArray] = useState<FlatNode[]>(flatJsonUI as FlatNode[]);

    const componentMap = {
        input: (props: any) => <input {...props} />,
        textarea: (props: any) => <textarea {...props} />,
        button: (props: any) => {
          const handleClick = () => {
            if (props.action && actionMap[props.action]) {
              actionMap[props.action](props); // Pass full props if needed
            }
            console.log("click!!!");
          };
          return (
            <button {...props} onClick={handleClick}>
              {props.text}
            </button>
          );
        },
        text: (props: any) => <p {...props}>{props.text}</p>,
      
    
        select: (props: any) => {
          const { options, ...rest } = props;
          return (
            <select {...rest}>
              {options?.map((opt: string, idx: number) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        },
      
        
        card: (props: any) => {
          return <div {...props}>{props.children}</div>; // children might be injected later dynamically
        }
      };
    
      const actionMap: Record<string, (props?: any) => void> = {
        "add-entry": () => alert("✅ Entry added!"),
        "export-data": () => alert("📤 Data exported."),
        "clear-data": () => alert("🗑️ All entries cleared.")
      };
      
    type FlatNode = {
        type: keyof typeof componentMap;
        props: Record<string, any>;
    };

    const renderFlatUI = (jsonArray: FlatNode[]) => {
        return jsonArray.map((node, index) => {
            const Component = componentMap[node.type];
            if (!Component) return null;
            return <Component key={index} {...node.props} />;
        });
    };
    

    const handleClick = async () => {
        if (!query.trim()) return alert("Please enter a query!");

        try {
          setLoading(true);

          const response = await fetch('/api/schema_generator', {
              method: 'POST',
              body: JSON.stringify({ query })
          });

          if(!response.ok){
            throw new Error(`Server Error: ${response.status}`);
          }

          const data = await response.json();

          setLoading(false);
          setMyJsonArray(data as FlatNode[]);
          console.log(data);

        } catch (error) {
            console.error(`Error fetching UI: ${error}`);
            alert("Something went wrong while generating the UI.");
        } finally {
          setLoading(false);
        }

      }
        
  return (
    <>
    <div className="flex flex-col justify-center mt-10">
        <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-white text-xl text-white p-3 m-2 rounded-md"
            placeholder="e.g., I want a meal logging dashboard with charts and a form to log food"
        />
        <button 
            className="border border-white text-white text-2xl m-2 p-3 rounded-md bg-blue-600 cursor-pointer" 
            onClick={handleClick}>
                Generate App
        </button>
    </div>

    {
      loading? (
        <div className="flex justify-center mt-10">
          <p className="text-white text-2xl m-2 p-2"> You app is loading</p>
        </div>
      ): (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 mt-10 text-center">---------- generated application -----------</h2>
          {renderFlatUI(myJsonArray)}
        </div>
      )
    }
    </>
  )
}