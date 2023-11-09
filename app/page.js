"use client"
import Image from 'next/image'
import {useState} from "react";
import {Form, useFieldArray, useForm} from "react-hook-form";

export default function Home() {
    const [nameStore,setNameStore] = useState()
    const [sql,setSql] = useState()
    const [generateSql, setGenerateSql] = useState("")
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            test:[{},{}],
        },
        // defaultValues: {}; you can populate the fields by this attribute
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "test"
    });
    const handNameStore = (e) => {
        setNameStore(e.target.value)
    }
    const handInputSql = (e) => {
        setSql(e.target.value)
    }
    const handGenerateSql = () => {
const text =
`
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[${nameStore}]'))
BEGIN
  EXEC sp_executesql N'CREATE PROCEDURE [dbo].[${nameStore}] AS select 1'
  PRINT 'Creating SP [dbo].[${nameStore}]'
END
GO
${sql}
GO
PRINT 'Altering SP [dbo].[${nameStore}]'
`
     setGenerateSql(text)
    }
    const onFormSubmit = data => {
        let text = "";
        const regex = /\[(.*?)\]/;

    data.test.map(item => {
        const matches = item.value.match(regex);
        const nameColumn = matches ? matches[1] : null;
        if(nameColumn !== null){
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
        <div className="flex gap-4 items-center mb-3">
            <div>
                    <input
                        type="text"
                        className="block h-12 w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Name store"
                        onChange={(e) =>handNameStore(e)}
                    />

            </div>

        </div>
        <div className="flex  gap-4 items-center">

           <div>
               <h1>Store</h1>
               <div>Input here</div>
            <textarea
                name="price"
                id="price"
                className="content-stretch w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 min-w-full"
                onChange={(e) =>handInputSql(e)}
            />
               <button className="bg-sky-500 h-12 p-2 rounded-lg" onClick={() =>handGenerateSql()}>Generate</button>
           </div>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <h1>Table</h1>
                <ul>
                    {fields.map((item, index) => (
                        <li key={item.id} className="flex gap-4 mb-3">
                            <input className="content-stretch w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 min-w-full"
                                   type="text" {...register(`test.${index}.value`)} />
                            {/*<Controller*/}
                            {/*    render={({ field }) => <input {...field} />}*/}
                            {/*    name={`test.${index}.lastName`}*/}
                            {/*    control={control}*/}
                            {/*/>*/}
                            <button type="button" className="bg-sky-500 h-12 p-2 rounded-lg mr-3" onClick={() => remove(index)}>Delete</button>
                        </li>
                    ))}
                </ul>

                <div>
                    <button className="bg-sky-500 h-12 p-2 rounded-lg mr-3"
                            type="button"
                            onClick={() => append()}
                    >
                        append
                    </button>
                    <input className="bg-sky-500 h-12 p-2 rounded-lg" type="submit" />
                </div>
            </form>
        </div>
        <div>Copy here</div>
        <div className="h-96">
            <textarea
                className="h-full block w-full rounded-md border-0 py-1.5 pl-28 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={generateSql}
            />
        </div>
    </main>
  )
}
