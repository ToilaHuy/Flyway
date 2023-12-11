"use client"
import Image from 'next/image'
import {useEffect, useState} from "react";
import {Form, useFieldArray, useForm} from "react-hook-form";

export default function Home() {
    const [nameStore,setNameStore] = useState()
    const [sql,setSql] = useState("")
    const [generateSql, setGenerateSql] = useState("")
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            table:[{},{}],
            store:[{}]
        },

        // defaultValues: {}; you can populate the fields by this attribute
    });
    const { fields:fieldsTable, append:appendTable, remove:removeTable } = useFieldArray({
        control,
        name: "table"
    });
    const { fields:fieldsStore, append:appendStore, remove:removeStore } = useFieldArray({
        control,
        name: "store"
    });

    const handNameStore = (e) => {
        setNameStore(e.target.value)
    }
    const handInputSql = (e) => {
        setSql(e.target.value)
    }
    useEffect(() => {
        setSql(prevState => prevState = generateSql)
    },[generateSql])
    const handGenerateSql = data => {
        console.log(data)
        setGenerateSql("")
        let text = ""
        data.store.map(item => {
            if(item.name.length > 0){
                text +=
                    `
--${item.name}
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[${item.name}]'))
BEGIN
  EXEC sp_executesql N'CREATE PROCEDURE [dbo].[${item.name}] AS select 1'
  PRINT 'Creating SP [dbo].[${item.name}]'
END
GO
${item.value}
GO
PRINT 'Altering SP [dbo].[${item.name}]'
`
            }
        })
     setGenerateSql( prevState => prevState = text)
     console.log(generateSql)
    }
    const onFormSubmit = data => {
        let text = "";
        const regex = /\[(.*?)\]/;

    data.table.map(item => {
        console.log(item.value)
        const nameColumn = item.value.split(" ")[0];
        console.log(nameColumn)
        setGenerateSql("")
        if(nameColumn !== ""){
            text += `
IF NOT EXISTS (
SELECT 1
FROM sys.columns
WHERE OBJECT_ID = OBJECT_ID('dbo.${nameStore}')
AND NAME = '${nameColumn}'
)
BEGIN
    ALTER TABLE [dbo].[${nameStore}]
    ADD ${item.value}
    PRINT 'Column added: ${nameColumn}'
END
ELSE
BEGIN
    PRINT 'Column already exists: ${nameColumn}'
END

`
        }
    })
        setGenerateSql(text)
    }
  return (
    <main className=" min-h-screenh items-center p-24">
        <div className="flex-col  gap-4 items-center">
           <div>
               <form onSubmit={handleSubmit(handGenerateSql)}>
                   <h1>store</h1>
                   <ul>
                       {fieldsStore.map((item, index) => (
                           <li key={item.id} className="flex gap-4 mb-3">
                               <input className="content-stretch max-w-3xl rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                                         type="text" {...register(`store.${index}.name`)} />
                               <textarea className="content-stretch w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                                      {...register(`store.${index}.value`)} />
                               <button type="button" className="bg-sky-500 h-12 p-2 rounded-lg mr-3" onClick={() => removeStore( index)}>Delete</button>
                           </li>
                       ))}
                   </ul>

                   <div>
                       <button className="bg-sky-500 h-12 p-2 rounded-lg mr-3"
                               type="button"
                               onClick={() => appendStore()}
                       >
                           append
                       </button>
                       <input className="bg-sky-500 h-12 p-2 rounded-lg" type="submit" />
                   </div>
               </form>
           </div>
            <form className="mt-6" onSubmit={handleSubmit(onFormSubmit)}>
                <h1>Table</h1>
                <div>
                    <input
                        type="text"
                        className="block h-12 max-w-3xl mb-3 rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Name table"
                        onChange={(e) =>handNameStore(e)}
                    />
                </div>
                <ul>
                    {fieldsTable.map((item, index) => (
                        <li key={item.id} className="flex gap-4 mb-3">
                            <input className="content-stretch w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 min-w-full"
                                   type="text" {...register(`table.${index}.value`)} />
                            <button type="button" className="bg-sky-500 h-12 p-2 rounded-lg mr-3" onClick={() => removeTable(index)}>Delete</button>
                        </li>
                    ))}
                </ul>

                <div>
                    <button className="bg-sky-500 h-12 p-2 rounded-lg mr-3"
                            type="button"
                            onClick={() => appendTable()}
                    >
                        append
                    </button>
                    <input className="bg-sky-500 h-12 p-2 rounded-lg" type="submit" />
                </div>
            </form>
        </div>
        <div>Copy here</div>
        <div className="h-96">
            <textarea    id="message"
                         name="message"
                className="h-full block w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={sql}
            />
        </div>
    </main>
  )
}
