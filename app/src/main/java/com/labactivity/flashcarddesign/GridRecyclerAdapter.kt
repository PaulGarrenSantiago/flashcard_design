package com.labactivity.flashcarddesign

import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView

import com.labactivity.flashcarddesign.databinding.HomeItemsBinding


class GridRecyclerAdapter(private val gridList: List<GridList>)
    :  RecyclerView.Adapter<GridRecyclerAdapter.ViewHolder>(){
    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): GridRecyclerAdapter.ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = HomeItemsBinding.inflate(inflater, parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = gridList[position]
        holder.bind(item)
        holder.itemView.setOnClickListener{
            val context = holder.itemView.context
            val intent = when (position){
                0 -> Intent(context, SampleFlashcards::class.java)
                1 -> Intent(context, SampleFlashcardsDB::class.java)
                2 -> Intent(context, SampleFlashcards2::class.java)
                3 -> Intent(context, SampleFlashcardsCloud::class.java)
                4 -> Intent(context, SampleFlashcardsGameDev::class.java)
                5 -> Intent(context, SampleFlashcardsIOT::class.java)
                else -> null
            }
            intent?.let {
                context.startActivity(it)
            }
        }

    }

    override fun getItemCount(): Int {
       return gridList.size
    }
    inner class ViewHolder(private val binding: HomeItemsBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: GridList) {
            binding.categoryIcon1.setImageResource(item.image)
            binding.categoryTextview1.text = item.title
            binding.categoryDesc.text = item.description
        }
    }

}