package com.labactivity.flashcarddesign

import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.labactivity.flashcarddesign.databinding.ItemLayoutBinding

class FlashcardAdapter(
    private val flashcardsList: List<FlashcardsList>
) : RecyclerView.Adapter<FlashcardAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = ItemLayoutBinding.inflate(inflater, parent, false)
        return ViewHolder(binding)
    }

    override fun getItemCount(): Int {
        return flashcardsList.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = flashcardsList[position]
        holder.bind(item)
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = when (position) {
                0 -> Intent(context, SampleFlashcards::class.java)
                1 -> Intent(context, SampleFlashcards2::class.java)
                else -> null
            }
            intent?.let {
                context.startActivity(it)
            }
        }
    }

    inner class ViewHolder(private val binding: ItemLayoutBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: FlashcardsList) {
            binding.categoryIcon1.setImageResource(item.image)
            binding.categoryTextview1.text = item.title
        }
    }
}
